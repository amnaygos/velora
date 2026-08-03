"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABEL } from "@/lib/admin/format";
import type { MilestoneStatus, ProjectStage } from "@/types/database";

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
  await supabase.from("portfolio_items").insert({
    name: projectName,
    slug,
    category: CATEGORY_LABEL[category] ?? category,
    location,
    year: String(new Date().getFullYear()),
    status: "draft",
    project_id: projectId,
  });

  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}
