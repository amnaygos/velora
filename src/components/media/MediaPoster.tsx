import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

/**
 * Static poster stand-in for a video asset — used for reduced motion,
 * loading states, and error states.
 */
export function MediaPoster({
  asset,
  className,
  sizes = "100vw",
}: {
  asset: MediaAsset;
  className?: string;
  sizes?: string;
}) {
  if (!asset.poster) {
    return <div className={cn("bg-shadow", className)} aria-hidden="true" />;
  }
  return (
    <div className={cn("relative overflow-hidden bg-shadow", className)}>
      <Image
        src={asset.poster}
        alt={asset.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
