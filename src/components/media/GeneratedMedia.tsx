import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { cssRatio, getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Renders any registry asset by id — image or looping film — holding
 * the asset's aspect ratio.
 */
export function GeneratedMedia({
  id,
  className,
  sizes,
  eager = false,
}: {
  id: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const asset = getMedia(id);

  if (asset.type === "image") {
    return (
      <ResponsiveImage
        asset={asset}
        className={className}
        sizes={sizes}
        eager={eager}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-shadow", className)}
      style={{ aspectRatio: cssRatio(asset.aspectRatio) }}
    >
      <div className="absolute inset-0">
        <ResponsiveVideo asset={asset} />
      </div>
    </div>
  );
}
