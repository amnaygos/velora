"use client";

import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { consultancy } from "@/content/consultancy";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * How an engagement runs — a single line travels down the page and
 * activates each of the four stages as it passes. Mirrors the About
 * page's approach timeline in a lighter form.
 */
export function ConsultancyProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reducedMotion) return;

      gsap.fromTo(
        "[data-consult-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-consult-list]",
            start: "top 70%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-consult-stage]").forEach((stage) => {
        gsap.fromTo(
          stage,
          { opacity: 0.25, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: EASE,
            scrollTrigger: { trigger: stage, start: "top 68%", once: true },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-carbon px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <SectionEyebrow>{consultancy.processEyebrow}</SectionEyebrow>

      <div data-consult-list className="relative mt-16 lg:mt-20">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 lg:left-[9px]"
        >
          <div
            data-consult-line
            className="h-full w-px origin-top scale-y-0 bg-olive"
          />
        </div>

        <ol className="space-y-16 lg:space-y-24">
          {consultancy.process.map((stage) => (
            <li
              key={stage.index}
              data-consult-stage
              className="relative grid gap-4 pl-12 lg:grid-cols-[10rem_1fr] lg:gap-12 lg:pl-16"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 h-4 w-4 border border-olive/70 bg-carbon lg:h-5 lg:w-5"
              />
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                {stage.index} — {stage.title}
              </p>
              <p className="max-w-2xl text-lg font-light leading-[1.5] text-white/85 sm:text-xl">
                {stage.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
