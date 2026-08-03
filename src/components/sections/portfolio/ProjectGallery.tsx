import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { getMediaOrNull } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

/**
 * Image sequence, sized like an editorial spread: every frame's width is
 * capped so its height never exceeds a comfortable share of the viewport,
 * and frames alternate left / right / center for rhythm.
 */
export function ProjectGallery({ project }: { project: Project }) {
  if (!project.gallery.length) return null;

  return (
    <section
      className="bg-carbon px-5 pb-24 sm:px-8 lg:px-12"
      aria-label={`${project.title} — image sequence`}
    >
      <div className="space-y-16 lg:space-y-24">
        {project.gallery.map((mediaId, index) => {
          const asset = getMediaOrNull(mediaId);
          if (!asset) return null;
          const [w, h] = asset.aspectRatio.split(":").map(Number);
          const ratio = (w || 16) / (h || 9);
          // Alternate the frame's height budget and horizontal placement.
          const heightVh = index % 3 === 1 ? 52 : 64;
          return (
            <div
              key={`${mediaId}-${index}`}
              className={cn(
                "w-full",
                index % 3 === 1 && "lg:ml-auto",
                index % 3 === 2 && "lg:mx-auto",
              )}
              style={{
                maxWidth: `min(100%, calc(${heightVh}vh * ${ratio.toFixed(4)}))`,
              }}
            >
              <ArchitecturalReveal delay={index === 0 ? 0 : 0.08}>
                <GeneratedMedia
                  id={mediaId}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                />
              </ArchitecturalReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
