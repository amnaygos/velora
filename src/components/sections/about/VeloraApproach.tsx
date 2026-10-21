"use client";

import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STAGES = [
  {
    index: "01",
    title: "VISION",
    copy: "Understand what people should feel before defining what the space should contain.",
  },
  {
    index: "02",
    title: "DESIGN",
    copy: "Every spatial, material, technical, and operational choice is made deliberately.",
  },
  {
    index: "03",
    title: "BUILD",
    copy: "Construction is supervised with the same care applied to design.",
  },
  {
    index: "04",
    title: "SUSTAIN",
    copy: "VELORA remains involved through management, refinement, and long-term performance.",
  },
] as const;

/**
 * A single line travels down the page and activates each stage of the
 * VELORA approach as it passes.
 */
export function VeloraApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reducedMotion) return;

      gsap.fromTo(
        "[data-approach-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-approach-list]",
            start: "top 70%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-approach-stage]").forEach((stage) => {
        gsap.fromTo(
          stage,
          { opacity: 0.25, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: EASE,
            scrollTrigger: { trigger: stage, start: "top 62%", once: true },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <SectionEyebrow>THE VELORA APPROACH</SectionEyebrow>

      <div data-approach-list className="relative mt-16 lg:mt-24">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 lg:left-[9px]"
        >
          <div
            data-approach-line
            className="h-full w-px origin-top scale-y-0 bg-olive"
          />
        </div>

        <ol className="space-y-20 lg:space-y-28">
          {STAGES.map((stage) => (
            <li
              key={stage.index}
              data-approach-stage
              className="relative grid gap-4 pl-12 lg:grid-cols-[10rem_1fr] lg:gap-12 lg:pl-16"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 h-4 w-4 border border-olive/70 bg-carbon lg:h-5 lg:w-5"
              />
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                {stage.index} — {stage.title}
              </p>
              <p className="max-w-2xl text-lg font-light leading-[1.4] text-white/85 sm:text-xl">
                “{stage.copy}”
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
