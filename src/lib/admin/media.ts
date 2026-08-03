export const PROJECT_MEDIA_BUCKET = "project-media";

/**
 * Public URL for a file in the project-media bucket. The bucket is public,
 * so images can be served straight from Storage with no signed URL.
 */
export function mediaUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${PROJECT_MEDIA_BUCKET}/${storagePath}`;
}

export const PHASE_LABEL: Record<string, string> = {
  before: "BEFORE",
  progress: "PROGRESS",
  after: "AFTER",
};

export const PHASE_ORDER = ["before", "progress", "after"] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // must match the bucket's file_size_limit
