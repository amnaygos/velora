"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { roleFromUser } from "@/lib/admin/rbac";
import { PORTFOLIO_TAG } from "@/lib/website";
import { PROJECT_CATEGORIES } from "@/types/project";
import type { PortfolioItem } from "@/types/database";

export type PortfolioResult = { ok: boolean; id?: string; slug?: string; error?: string };

/** What the editor sends. The slug is set once, at creation, so links never break. */
export type PortfolioInput = Pick<
  PortfolioItem,
  | "name" | "category" | "location" | "year" | "area" | "delivery" | "services"
  | "description" | "brief" | "response" | "outcome" | "metrics"
  | "hero_media" | "gallery" | "before_media" | "after_media" | "before_condition"
  | "featured" | "status"
>;

async function managerClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "Not signed in." };
  if (roleFromUser(user) !== "manager") return { supabase, error: "Managers only." };
  return { supabase, error: null };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const text = (v: string | null | undefined) => (v ?? "").trim() || null;

function clean(input: PortfolioInput) {
  return {
    name: input.name.trim(),
    category: input.category,
    location: text(input.location),
    year: text(input.year),
    area: text(input.area),
    delivery: text(input.delivery),
    services: input.services.map((s) => s.trim()).filter(Boolean),
    description: text(input.description),
    brief: text(input.brief),
    response: text(input.response),
    outcome: text(input.outcome),
    metrics: input.metrics
      .map((m) => ({ label: m.label.trim(), value: m.value.trim() }))
      .filter((m) => m.label && m.value),
    hero_media: text(input.hero_media),
    gallery: input.gallery.filter(Boolean),
    before_media: text(input.before_media),
    after_media: text(input.after_media),
    before_condition: text(input.before_condition),
    featured: input.featured,
    status: input.status,
  };
}

/** Why a case study can't go live yet, or null when it can. */
function publishProblem(row: ReturnType<typeof clean>): string | null {
  if (!row.name) return "Give the project a name.";
  if (!(PROJECT_CATEGORIES as readonly string[]).includes(row.category)) return "Choose a category.";
  if (row.status === "published" && !row.hero_media && !row.after_media) return "Add a cover photo before publishing.";
  if (Boolean(row.before_media) !== Boolean(row.after_media)) return "A before & after needs both photos, or neither.";
  return null;
}

function expire(slug?: string) {
  updateTag(PORTFOLIO_TAG);
  revalidatePath("/admin/portfolio");
  if (slug) revalidatePath(`/admin/portfolio/${slug}`);
}

/** Create (id = null) or update a case study. */
export async function savePortfolioItem(id: string | null, input: PortfolioInput): Promise<PortfolioResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };

  const row = clean(input);
  const problem = publishProblem(row);
  if (problem) return { ok: false, error: problem };

  if (id) {
    const { data, error } = await supabase.from("portfolio_items").update(row).eq("id", id).select("id, slug").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Project not found." };
    expire(data.id);
    return { ok: true, id: data.id, slug: data.slug };
  }

  // New entries go to the end of the portfolio, under a free web address.
  const base = slugify(row.name) || "project";
  const { data: taken } = await supabase.from("portfolio_items").select("slug, sort_order").like("slug", `${base}%`);
  const slugs = new Set((taken ?? []).map((t) => t.slug));
  let slug = base;
  for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
  const { data: last } = await supabase.from("portfolio_items").select("sort_order").order("sort_order", { ascending: false }).limit(1);

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({ ...row, slug, sort_order: (last?.[0]?.sort_order ?? 0) + 1 })
    .select("id, slug")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't create the project." };
  expire();
  return { ok: true, id: data.id, slug: data.slug };
}

export async function deletePortfolioItem(id: string): Promise<PortfolioResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  expire();
  return { ok: true };
}

/** The portfolio's order on the site, as dragged in the admin. */
export async function reorderPortfolio(ids: string[]): Promise<PortfolioResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  const results = await Promise.all(
    ids.map((id, index) => supabase.from("portfolio_items").update({ sort_order: index + 1 }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  expire();
  return { ok: true };
}

/** Publish or unpublish straight from the list. */
export async function setPortfolioStatus(id: string, status: PortfolioItem["status"]): Promise<PortfolioResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  if (status === "published") {
    const { data } = await supabase.from("portfolio_items").select("hero_media, after_media").eq("id", id).single();
    if (!data?.hero_media && !data?.after_media) return { ok: false, error: "Add a cover photo before publishing." };
  }
  const { error } = await supabase.from("portfolio_items").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  expire(id);
  return { ok: true };
}
