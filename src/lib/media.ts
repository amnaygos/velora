import type { MediaAsset } from "@/types/media";
import { mediaRegistry } from "@/content/mediaRegistry";

export function getMedia(id: string): MediaAsset {
  const asset = mediaRegistry[id];
  if (!asset) {
    throw new Error(`Unknown media asset: "${id}"`);
  }
  return asset;
}

export function getMediaOrNull(id: string): MediaAsset | null {
  return mediaRegistry[id] ?? null;
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
