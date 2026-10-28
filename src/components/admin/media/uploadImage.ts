"use client";

import { createClient } from "@/lib/supabase/client";
import { buildMediaRef } from "@/lib/media";

export const SITE_MEDIA_BUCKET = "site-media";
export const UPLOAD_FOLDER = "portfolio";
const MAX_EDGE = 2400; // long edge after resizing; plenty for a full-bleed hero

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file isn't an image the browser can read."));
    img.src = src;
  });
}

/** Measures an image already in storage (its size goes into the media reference). */
export async function measureImage(src: string): Promise<{ width: number; height: number }> {
  const img = await loadImage(src);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

/**
 * Resizes a photo in the browser (long edge ≤ 2400 px, WebP), uploads it to
 * the public site-media bucket and returns the media reference to store.
 */
export async function uploadImage(
  file: File,
  { folder = UPLOAD_FOLDER, maxEdge = MAX_EDGE }: { folder?: string; maxEdge?: number } = {}
): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose a photo (JPEG, PNG, WebP or AVIF).");

  const url = URL.createObjectURL(file);
  let blob: Blob;
  let width: number;
  let height: number;
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    width = Math.round(img.naturalWidth * scale);
    height = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
    blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't prepare the photo."))), "image/webp", 0.86)
    );
  } finally {
    URL.revokeObjectURL(url);
  }

  const supabase = createClient();
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(SITE_MEDIA_BUCKET).upload(path, blob, { contentType: "image/webp" });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);
  return buildMediaRef({ src: data.publicUrl, width, height, alt: "" });
}

/** Photos uploaded earlier, newest first. */
export async function listUploads(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .list(UPLOAD_FOLDER, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((f) => f.id && !f.name.startsWith("."))
    .map((f) => supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(`${UPLOAD_FOLDER}/${f.name}`).data.publicUrl);
}

/** The average colour of a photo, as #rrggbb — a material's flat tone, read from the file before upload. */
export async function fileTone(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 24, 24);
    const px = ctx.getImageData(0, 0, 24, 24).data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < px.length; i += 4) {
      r += px[i];
      g += px[i + 1];
      b += px[i + 2];
    }
    const n = px.length / 4;
    return "#" + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("");
  } finally {
    URL.revokeObjectURL(url);
  }
}
