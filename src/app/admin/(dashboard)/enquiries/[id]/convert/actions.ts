"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectCategory, ProjectStage } from "@/types/database";

const STAGE_VALUES: ProjectStage[] = ["consultation", "design", "build", "operations"];

function inferCategory(projectType: string): ProjectCategory {
  const t = projectType.toLowerCase();
  if (t.includes("spa") || t.includes("wellness") || t.includes("recovery")) return "spa_wellness";
  if (t.includes("hotel")) return "hospitality";
  return "gyms_fitness";
}

/** Best-effort numeric extraction from free-text budget ranges like
 * "QAR 2,000,000 – 5,000,000" or "Under QAR 500,000". Two numbers found
 * are averaged; one number is used as-is; none found returns null. */
function parseBudgetValue(budgetRange: string): number | null {
  const numbers = budgetRange.match(/[\d,]+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return null;
  const parsed = numbers
    .map((n) => Number(n.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (parsed.length === 0) return null;
  if (parsed.length === 1) return parsed[0];
  return Math.round((parsed[0] + parsed[1]) / 2);
}

export async function convertEnquiryToProject(enquiryId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const clientName = String(formData.get("client_name") || "").trim();
  const clientEmail = String(formData.get("client_email") || "").trim();
  const clientPhone = String(formData.get("client_phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const projectType = String(formData.get("project_type") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const budgetRange = String(formData.get("budget_range") || "").trim();
  const targetCompletion = String(formData.get("target_completion") || "").trim();
  const brief = String(formData.get("brief") || "").trim();
  const leadPrincipal = String(formData.get("lead_principal") || "").trim();
  const designer = String(formData.get("designer") || "").trim();

  const stageRaw = String(formData.get("stage") || "consultation").trim();
  const stage: ProjectStage = STAGE_VALUES.includes(stageRaw as ProjectStage)
    ? (stageRaw as ProjectStage)
    : "consultation";

  if (!name || !clientName) {
    throw new Error("Project name and client are required.");
  }

  const { data: projectRows, error: insertError } = await supabase
    .from("projects")
    .insert({
      name,
      category: inferCategory(projectType),
      client_name: clientName,
      client_email: clientEmail || null,
      client_phone: clientPhone || null,
      company: company || null,
      project_type: projectType || null,
      location: location || null,
      budget_range: budgetRange || null,
      budget_value: budgetRange ? parseBudgetValue(budgetRange) : null,
      stage,
      lead_principal: leadPrincipal || null,
      designer: designer || null,
      target_completion: targetCompletion || null,
      brief: brief || null,
      enquiry_id: enquiryId,
    })
    .select("id")
    .returns<{ id: string }[]>();

  const newProject = projectRows?.[0];

  if (insertError || !newProject) {
    throw new Error("Failed to create project from enquiry.");
  }

  const { error: updateError } = await supabase
    .from("enquiries")
    .update({ status: "converted", converted_project_id: newProject.id })
    .eq("id", enquiryId);

  if (updateError) {
    throw new Error("Project created, but failed to update the enquiry status.");
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/projects");
  revalidatePath("/admin");

  redirect(`/admin/projects/${newProject.id}`);
}
