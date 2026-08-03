"use client";

import { useRef } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import type { Project } from "@/types/project";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Project hero. The media lives in a height-capped, full-bleed band so no
 * source ratio can overflow the viewport; scroll widens it from a centered
 * rectangle to the full frame via clip-path (compositor-only, no reflow).
 */
export function ProjectHero({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const hero = getMedia(project.heroMedia);

  useGSAP(
    () => {
      if (!sectionRef.current || reducedMotion) return;
      const trigger = {
        trigger: "[data-project-hero-band]",
        start: "top 82%",
        end: "top 18%",
        scrub: 0.8,
      };
      gsap.fromTo(
        "[data-project-hero-clip]",
        { clipPath: "inset(0% 15% 0% 15%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: trigger },
      );
      gsap.fromTo(
        "[data-project-hero-zoom]",
        { scale: 1.12 },
        { scale: 1, ease: "none", scrollTrigger: trigger },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-carbon pt-36 lg:pt-44">
      <div className="px-5 sm:px-8 lg:px-12">
        <SectionEyebrow>
          {project.category.toUpperCase()} — {project.location}
        </SectionEyebrow>
        <h1 className="mt-6 max-w-5xl text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.8rem]">
          {project.title}
        </h1>

        <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.2em]">
          <div>
            <dt className="text-white/35">YEAR</dt>
            <dd className="mt-1 text-white/80">{project.year}</dd>
          </div>
          {project.area ? (
            <div>
              <dt className="text-white/35">AREA</dt>
              <dd className="mt-1 text-white/80">{project.area}</dd>
            </div>
          ) : null}
          {project.delivery ? (
            <div>
              <dt className="text-white/35">DELIVERY</dt>
              <dd className="mt-1 text-white/80">{project.delivery}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-white/35">SERVICES</dt>
            <dd className="mt-1 text-white/80">{project.services.join(" · ")}</dd>
          </div>
        </dl>
      </div>

      <div
        data-project-hero-band
        className="relative mt-16 h-[48vh] overflow-hidden sm:h-[60vh] lg:h-[76vh]"
      >
        <div
          data-project-hero-clip
          className="absolute inset-0 will-change-[clip-path]"
        >
          <div
            data-project-hero-zoom
            className="absolute inset-0 will-change-transform"
          >
            <ResponsiveImage
              asset={hero}
              keepRatio={false}
              className="h-full w-full"
              sizes="100vw"
              eager
            />
          </div>
        </div>
      </div>
    </section>
  );
}
