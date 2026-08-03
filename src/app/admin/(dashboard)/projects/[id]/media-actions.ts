"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_MEDIA_BUCKET } from "@/lib/admin/media";
import type { MediaPhase, ProjectMedia } from "@/types/database";

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
}

/**
 * Records a file that the browser has ALREADY uploaded to Storage.
 * The upload itself happens client-side (Server Actions cap request bodies
 * at ~1MB, far below a real photo), so this only writes the metadata row.
 */
export async function addProjectMedia(
  projectId: string,
  storagePath: string,
  phase: MediaPhase
) {
  const supabase = await createClient();

  const [{ count }, { count: existingCount }] = await Promise.all([
    supabase
      .from("project_media")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase
      .from("project_media")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId)
      .eq("is_cover", true),
  ]);

  await supabase.from("project_media").insert({
    project_id: projectId,
    storage_path: storagePath,
    phase,
    sort_order: count ?? 0,
    // First image uploaded for a project becomes its cover automatically.
    is_cover: (existingCount ?? 0) === 0,
  });

  revalidateProject(projectId);
}

export async function deleteProjectMedia(projectId: string, mediaId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("project_media")
    .select("storage_path, is_cover")
    .eq("id", mediaId)
    .returns<Pick<ProjectMedia, "storage_path" | "is_cover">[]>();

  const media = data?.[0];
  if (!media) return;

  // Remove the row first, then the file. If the file removal fails we've at
  // least not left a row pointing at nothing the UI would render as broken.
  await supabase.from("project_media").delete().eq("id", mediaId);
  await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([media.storage_path]);

  // If we just deleted the cover, promote the next image so the project
  // doesn't silently lose its thumbnail on the board.
  if (media.is_cover) {
    const { data: next } = await supabase
      .from("project_media")
      .select("id")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .returns<Pick<ProjectMedia, "id">[]>();

    if (next?.[0]) {
      await supabase.from("project_media").update({ is_cover: true }).eq("id", next[0].id);
    }
  }

  revalidateProject(projectId);
}

export async function setCoverMedia(projectId: string, mediaId: string) {
  const supabase = await createClient();

  // Clear the old cover before setting the new one — a partial unique index
  // enforces one cover per project, so both can't be true at once.
  await supabase
    .from("project_media")
    .update({ is_cover: false })
    .eq("project_id", projectId)
    .eq("is_cover", true);

  await supabase.from("project_media").update({ is_cover: true }).eq("id", mediaId);

  revalidateProject(projectId);
}

export async function updateMediaDetails(
  projectId: string,
  mediaId: string,
  caption: string,
  phase: MediaPhase
) {
  const supabase = await createClient();
  await supabase
    .from("project_media")
    .update({ caption: caption.trim() || null, phase })
    .eq("id", mediaId);

  revalidateProject(projectId);
}

/** Swaps sort_order with the adjacent image, moving this one left or right. */
export async function reorderMedia(
  projectId: string,
  mediaId: string,
  direction: "left" | "right"
) {
  const supabase = await createClient();

  const { data: all } = await supabase
    .from("project_media")
    .select("id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .returns<Pick<ProjectMedia, "id" | "sort_order">[]>();

  if (!all) return;

  const index = all.findIndex((m) => m.id === mediaId);
  const swapWith = direction === "left" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= all.length) return;

  const a = all[index];
  const b = all[swapWith];

  await Promise.all([
    supabase.from("project_media").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("project_media").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidateProject(projectId);
}
