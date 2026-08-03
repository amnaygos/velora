import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Project, ProjectMedia, ProjectMilestone } from "@/types/database";

export const dynamic = "force-dynamic";

interface EnquiryPreview {
  name: string;
  email: string;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: projectRows }, { data: milestones }, { data: media }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).returns<Project[]>(),
    supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true })
      .returns<ProjectMilestone[]>(),
    supabase
      .from("project_media")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true })
      .returns<ProjectMedia[]>(),
  ]);

  const project = projectRows?.[0] ?? null;

  if (!project) {
    notFound();
  }

  let enquiry: EnquiryPreview | null = null;
  if (project.enquiry_id) {
    const { data: enquiryRows } = await supabase
      .from("enquiries")
      .select("name, email")
      .eq("id", project.enquiry_id)
      .returns<EnquiryPreview[]>();
    enquiry = enquiryRows?.[0] ?? null;
  }

  return (
    <ProjectDetailClient
      project={project}
      milestones={milestones ?? []}
      media={media ?? []}
      enquiry={enquiry}
    />
  );
}
