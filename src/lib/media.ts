import type { MediaAsset } from "@/types/media";
import { mediaRegistry } from "@/content/mediaRegistry";

/**
 * A media reference is either the id of an asset in the registry (photography
 * shipped in /public) or the public URL of a photo uploaded from the admin.
 * Uploads carry their size and description in the URL fragment —
 * `https://…/photo.webp#w=1600&h=1067&alt=…` — so any component, server or
 * client, can render one without a lookup.
 */
export type UploadedMedia = { src: string; width: number; height: number; alt: string };

export function parseMediaRef(ref: string): UploadedMedia | null {
  if (!/^https?:\/\//.test(ref)) return null;
  const [src, fragment = ""] = ref.split("#");
  const params = new URLSearchParams(fragment);
  return {
    src,
    width: Number(params.get("w")) || 1600,
    height: Number(params.get("h")) || 1067,
    alt: params.get("alt") ?? "",
  };
}

export function buildMediaRef(media: UploadedMedia): string {
  const params = new URLSearchParams({ w: String(media.width), h: String(media.height) });
  if (media.alt) params.set("alt", media.alt);
  return `${media.src}#${params}`;
}

function uploadedAsset(ref: string): MediaAsset | null {
  const media = parseMediaRef(ref);
  if (!media) return null;
  return {
    id: ref,
    page: "portfolio",
    section: "upload",
    type: "image",
    model: "archive",
    prompt: "",
    aspectRatio: `${media.width}:${media.height}`,
    src: media.src,
    alt: media.alt,
    status: "ready",
  };
}

export function getMedia(id: string): MediaAsset {
  const asset = mediaRegistry[id] ?? uploadedAsset(id);
  if (!asset) {
    throw new Error(`Unknown media asset: "${id}"`);
  }
  return asset;
}

export function getMediaOrNull(id: string): MediaAsset | null {
  return mediaRegistry[id] ?? uploadedAsset(id);
}

/** Parse an "W:H" aspect ratio into image dimensions for next/image. */
export function dimensionsFromRatio(
  aspectRatio: string,
  baseWidth = 1600,
): { width: number; height: number } {
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return { width: baseWidth, height: baseWidth };
  return { width: baseWidth, height: Math.round((baseWidth * h) / w) };
}

/** CSS aspect-ratio value from an "W:H" string. */
export function cssRatio(aspectRatio: string): string {
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return "16 / 9";
  return `${w} / ${h}`;
}
