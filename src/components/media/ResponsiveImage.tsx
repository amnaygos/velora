import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { cssRatio } from "@/lib/media";
import { cn } from "@/lib/utils";

type ResponsiveImageProps = {
  asset: MediaAsset;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold media only. */
  eager?: boolean;
  /** Keep the wrapper's aspect ratio from the asset (default true). */
  keepRatio?: boolean;
};

export function ResponsiveImage({
  asset,
  sizes = "100vw",
  className,
  imgClassName,
  eager = false,
  keepRatio = true,
}: ResponsiveImageProps) {
  if (!asset.src) {
    // Asset not generated yet — hold the layout with a matte surface.
    return (
      <div
        className={cn("bg-shadow", className)}
        style={keepRatio ? { aspectRatio: cssRatio(asset.aspectRatio) } : undefined}
        role="img"
        aria-label={asset.alt}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-shadow", className)}
      style={keepRatio ? { aspectRatio: cssRatio(asset.aspectRatio) } : undefined}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
