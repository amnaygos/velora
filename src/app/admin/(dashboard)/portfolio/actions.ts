"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioStatus } from "@/types/database";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const year = String(formData.get("year") || "").trim();
  const before_image_url = String(formData.get("before_image_url") || "").trim();
  const after_image_url = String(formData.get("after_image_url") || "").trim();
  const status: PortfolioStatus = formData.get("status") === "draft" ? "draft" : "published";

  return { name, category, location, year, before_image_url, after_image_url, status };
}

export async function createPortfolioItem(formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name) return;

  const supabase = await createClient();
  await supabase.from("portfolio_items").insert({
    name: fields.name,
    slug: slugify(fields.name),
    category: fields.category,
    location: fields.location || null,
    year: fields.year || null,
    before_image_url: fields.before_image_url || null,
    after_image_url: fields.after_image_url || null,
    status: fields.status,
    sort_order: Date.now(),
  });

  revalidatePath("/admin/portfolio");
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const fields = readFields(formData);
  if (!fields.name) return;

  const supabase = await createClient();
  await supabase
    .from("portfolio_items")
    .update({
      name: fields.name,
      slug: slugify(fields.name),
      category: fields.category,
      location: fields.location || null,
      year: fields.year || null,
      before_image_url: fields.before_image_url || null,
      after_image_url: fields.after_image_url || null,
      status: fields.status,
    })
    .eq("id", id);

  revalidatePath("/admin/portfolio");
}

export async function deletePortfolioItem(id: string) {
  const supabase = await createClient();
  await supabase.from("portfolio_items").delete().eq("id", id);

  revalidatePath("/admin/portfolio");
}
