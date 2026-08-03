import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectMedia } from "@/types/database";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: covers }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Project[]>(),
    // One query for every cover, mapped by project below — avoids an N+1
    // of one media lookup per project card.
    supabase
      .from("project_media")
      .select("project_id, storage_path")
      .eq("is_cover", true)
      .returns<Pick<ProjectMedia, "project_id" | "storage_path">[]>(),
  ]);

  const coverByProject: Record<string, string> = {};
  (covers ?? []).forEach((c) => {
    coverByProject[c.project_id] = c.storage_path;
  });

  return <ProjectsClient projects={projects ?? []} coverByProject={coverByProject} />;
}
