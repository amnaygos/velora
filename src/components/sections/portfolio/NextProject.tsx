import { ArrowRight } from "lucide-react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { projects } from "@/content/projects";
import { getMedia } from "@/lib/media";
import type { Project } from "@/types/project";

/**
 * Closing chapter of every project page: the next project arrives as a
 * full-bleed cinematic band — index rule, metadata, masked title, and an
 * architectural arrow plate — its media rising into view before the
 * current page ends.
 */
export function NextProject({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const position = String(index + 1).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");
  const hero = getMedia(project.heroMedia);

  return (
    <section
      className="bg-carbon px-5 pb-28 pt-16 sm:px-8 lg:px-12"
      aria-label="Next project"
    >
      {/* index rule */}
      <div className="flex items-center gap-6">
        <p className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-white/40">
          NEXT PROJECT
        </p>
        <ArchitecturalRule className="flex-1" />
        <p className="shrink-0 text-[10px] tabular-nums tracking-[0.3em] text-white/40">
          <span className="text-olive">{position}</span> / {total}
        </p>
      </div>

      <TransitionLink
        href={`/portfolio/${project.slug}`}
        transitionLabel={`VELORA — ${project.title}`}
        data-cursor-label="OPEN"
        aria-label={`Next project: ${project.title} — ${project.category}, ${project.location}`}
        className="group relative mt-10 block"
      >
        <ArchitecturalReveal direction="bottom" material={false}>
          <div className="relative h-[56vh] overflow-hidden sm:h-[64vh] lg:h-[74vh]">
            {/* media: desaturated at rest, breathing back to color on hover */}
            <div className="absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [filter:grayscale(0.5)_brightness(0.6)] group-hover:scale-[1.025] group-hover:[filter:grayscale(0)_brightness(0.85)] group-focus-visible:[filter:grayscale(0)_brightness(0.85)]">
              <ResponsiveImage
                asset={hero}
                keepRatio={false}
                className="h-full w-full"
                sizes="100vw"
              />
            </div>

            {/* carbon gradient holding the text */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/30 to-carbon/5"
            />

            {/* fine frame line that completes on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-olive/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.24em] text-white/55">
                <span className="text-olive">
                  {project.category.toUpperCase()}
                </span>
                <span>{project.location}</span>
                <span>{project.year}</span>
                {project.area ? <span>{project.area}</span> : null}
              </div>

              <div className="mt-4 flex items-end justify-between gap-8">
                <SplitTextReveal
                  as="h2"
                  lines={[project.title]}
                  start="top 96%"
                  className="max-w-4xl text-lg font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white sm:text-xl lg:text-[1.85rem]"
                />
                {/* architectural arrow plate */}
                <span
                  aria-hidden="true"
                  className="mb-1 hidden h-14 w-14 shrink-0 items-center justify-center border border-white/40 text-white transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-carbon sm:flex lg:h-16 lg:w-16"
                >
                  <ArrowRight
                    size={20}
                    strokeWidth={1.25}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </span>
              </div>

              <p className="mt-5 hidden max-w-xl text-sm font-light leading-[1.7] text-white/60 lg:block">
                {project.description}
              </p>

              <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 sm:hidden">
                VIEW PROJECT
                <ArrowRight aria-hidden="true" size={12} strokeWidth={1.5} />
              </span>
            </div>
          </div>
        </ArchitecturalReveal>
      </TransitionLink>
    </section>
  );
}
