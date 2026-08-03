"use client";

import { motion } from "framer-motion";
import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import type { Project } from "@/types/project";
import { VELORA_EASE } from "@/lib/gsap";

/**
 * Borderless editorial project tile: image ratio preserved, slightly
 * desaturated at rest, returning to color on hover/focus; the title
 * reveals through a mask.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: VELORA_EASE }}
    >
      <TransitionLink
        href={`/portfolio/${project.slug}`}
        transitionLabel={`VELORA — ${project.title}`}
        data-cursor-label="OPEN"
        className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-olive"
        aria-label={`Open project: ${project.title}, ${project.category}, ${project.location}`}
      >
        <div className="relative overflow-hidden">
          <div className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [filter:grayscale(0.5)_brightness(0.85)] group-hover:scale-[1.025] group-hover:[filter:grayscale(0)_brightness(1)] group-focus-visible:[filter:grayscale(0)_brightness(1)]">
            <GeneratedMedia
              id={project.heroMedia}
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          {project.transformation ? (
            <span className="absolute left-4 top-4 border border-olive/50 bg-carbon/75 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.24em] text-olive">
              BEFORE / AFTER
            </span>
          ) : null}
        </div>

        <div className="mt-5 overflow-hidden">
          <h3 className="translate-y-0 text-base font-light uppercase tracking-[0.06em] text-white transition-transform duration-700 sm:text-lg">
            {project.title}
          </h3>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-white/40">
          <span className="text-olive/90">{project.category.toUpperCase()}</span>
          <span>{project.location}</span>
          <span>{project.year}</span>
        </div>
      </TransitionLink>
    </motion.article>
  );
}
