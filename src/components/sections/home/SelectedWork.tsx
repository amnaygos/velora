"use client";

import { useRef } from "react";
import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { featuredProjects } from "@/content/projects";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Chapter 06 — selected work. Each featured project holds roughly one
 * viewport: media arrives slightly desaturated and returns to full color
 * and scale as it becomes the active frame.
 */
export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || reducedMotion) return;
      // A single settled reveal per project — scrubbing a CSS filter
      // shimmers; a one-shot tween reads as the frame coming into focus.
      gsap.utils
        .toArray<HTMLElement>("[data-work-media]")
        .forEach((media) => {
          gsap.fromTo(
            media,
            { filter: "grayscale(0.6) brightness(0.72)", scale: 1.035 },
            {
              filter: "grayscale(0) brightness(1)",
              scale: 1,
              duration: 1.4,
              ease: EASE,
              scrollTrigger: {
                trigger: media,
                start: "top 72%",
                once: true,
              },
            },
          );
        });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-carbon px-5 py-28 sm:px-8 lg:px-12">
      <SectionEyebrow>SELECTED WORK</SectionEyebrow>
      <h2 className="mt-8 max-w-4xl text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.75rem]">
        CLARITY OF VISION.
        <br />
        CERTAINTY OF EXECUTION.
      </h2>

      <div className="mt-24 space-y-36 lg:space-y-48">
        {featuredProjects.map((project, index) => (
          <article
            key={project.slug}
            className="grid gap-10 lg:min-h-[88vh] lg:grid-cols-12 lg:items-center lg:gap-16"
          >
            <div
              className={
                index % 2 === 1
                  ? "lg:order-2 lg:col-span-7"
                  : "lg:col-span-7"
              }
            >
              <TransitionLink
                href={`/portfolio/${project.slug}`}
                transitionLabel={`VELORA — ${project.title}`}
                aria-label={`View project: ${project.title}`}
                data-cursor-label="VIEW"
                className="group block overflow-hidden"
              >
                <div data-work-media className="will-change-transform">
                  <GeneratedMedia
                    id={project.heroMedia}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
              </TransitionLink>
            </div>

            <div
              className={
                index % 2 === 1
                  ? "lg:order-1 lg:col-span-5"
                  : "lg:col-span-5"
              }
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-extralight uppercase tracking-[0.08em] text-white sm:text-xl">
                {project.title}
              </h3>

              <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.18em]">
                <div className="flex justify-between gap-6">
                  <dt className="text-white/35">PROJECT TYPE</dt>
                  <dd className="text-right text-white/75">
                    {project.category.toUpperCase()}
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-white/35">LOCATION</dt>
                  <dd className="text-right text-white/75">{project.location}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-white/35">SERVICES</dt>
                  <dd className="max-w-[60%] text-right text-white/75">
                    {project.services.join(" · ")}
                  </dd>
                </div>
                {project.area ? (
                  <div className="flex justify-between gap-6">
                    <dt className="text-white/35">AREA</dt>
                    <dd className="text-right text-white/75">{project.area}</dd>
                  </div>
                ) : null}
                {project.delivery ? (
                  <div className="flex justify-between gap-6">
                    <dt className="text-white/35">DELIVERY</dt>
                    <dd className="max-w-[60%] text-right text-white/75">
                      {project.delivery}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-8 space-y-5 text-sm font-light leading-[1.7] text-white/65">
                <p>
                  <span className="mr-3 text-[10px] uppercase tracking-[0.28em] text-white/40">
                    BRIEF
                  </span>
                  {project.brief}
                </p>
                <p>
                  <span className="mr-3 text-[10px] uppercase tracking-[0.28em] text-white/40">
                    OUTCOME
                  </span>
                  {project.outcome}
                </p>
              </div>

              <div className="mt-10">
                <TextLink
                  href={`/portfolio/${project.slug}`}
                  transitionLabel={`VELORA — ${project.title}`}
                >
                  VIEW PROJECT
                </TextLink>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-32 border-t border-white/10 pt-10">
        <TextLink href="/portfolio" transitionLabel="VELORA — PORTFOLIO">
          VIEW THE COMPLETE PORTFOLIO
        </TextLink>
      </div>
    </section>
  );
}
