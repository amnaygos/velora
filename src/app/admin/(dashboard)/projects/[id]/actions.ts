"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MilestoneStatus, ProjectStage } from "@/types/database";
import type { ProjectCategory as ProjectCategoryLabel } from "@/types/project";

export async function updateProjectFields(id: string, formData: FormData) {
  const stage = String(formData.get("stage") || "") as ProjectStage;
  const clientName = String(formData.get("client_name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const budgetRaw = String(formData.get("budget_value") || "").trim();
  const budgetValue = budgetRaw === "" || Number.isNaN(Number(budgetRaw)) ? null : Number(budgetRaw);
  const targetCompletion = String(formData.get("target_completion") || "").trim();

  const supabase = await createClient();
  await supabase
    .from("projects")
    .update({
      stage,
      client_name: clientName,
      location: location || null,
      budget_value: budgetValue,
      target_completion: targetCompletion || null,
    })
    .eq("id", id);

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function addMilestone(projectId: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "planned") as MilestoneStatus;
  const eventDate = String(formData.get("event_date") || "").trim();

  if (!title) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("project_milestones")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  await supabase.from("project_milestones").insert({
    project_id: projectId,
    title,
    description: description || null,
    status,
    event_date: eventDate || null,
    sort_order: count ?? 0,
  });

  revalidatePath(`/admin/projects/${projectId}`);
}

/** Project categories → the categories the public portfolio filters by. */
const PORTFOLIO_CATEGORY: Record<string, ProjectCategoryLabel> = {
  gyms_fitness: "Gyms & Fitness",
  spa_wellness: "Spa & Wellness",
  hospitality: "Hospitality",
};

export async function publishToPortfolio(
  projectId: string,
  projectName: string,
  category: string,
  location: string | null
) {
  const slug = projectName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const supabase = await createClient();
  // A project already published to the portfolio opens its case study instead of duplicating it.
  const { data: existing } = await supabase.from("portfolio_items").select("id").eq("project_id", projectId).maybeSingle();
  if (existing) redirect(`/admin/portfolio/${existing.id}`);

  const { data: taken } = await supabase.from("portfolio_items").select("slug").like("slug", `${slug}%`);
  const slugs = new Set((taken ?? []).map((t) => t.slug));
  let free = slug || "project";
  for (let n = 2; slugs.has(free); n++) free = `${slug}-${n}`;
  const { data: last } = await supabase.from("portfolio_items").select("sort_order").order("sort_order", { ascending: false }).limit(1);

  const { data: created } = await supabase
    .from("portfolio_items")
    .insert({
      name: projectName,
      slug: free,
      category: PORTFOLIO_CATEGORY[category] ?? "Gyms & Fitness",
      location,
      year: String(new Date().getFullYear()),
      status: "draft",
      project_id: projectId,
      sort_order: (last?.[0]?.sort_order ?? 0) + 1,
    })
    .select("id")
    .single();

  revalidatePath("/admin/portfolio");
  // Straight into the editor to add the photos and the story.
  redirect(created ? `/admin/portfolio/${created.id}` : "/admin/portfolio");
}
