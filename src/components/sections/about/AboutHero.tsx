"use client";

import { useRef } from "react";
import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { site } from "@/content/site";
import { useStudio } from "@/components/providers/StudioProvider";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The About opening: claim, character, and proof on one screen. The headline
 * makes the promise, the studio's own words sit beside it, the design film
 * shows the craft, and the numbers underneath back up "proven results".
 */
export function AboutHero() {
  const { figures: credentials } = useStudio();
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from("[data-hero-intro] > *", {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: EASE,
        stagger: 0.12,
        delay: 0.45,
      });
      gsap.from("[data-hero-stat]", {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: EASE,
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-hero-stats]", start: "top 92%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-carbon px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-32"
    >
      <div className="flex items-baseline justify-between gap-6">
        <SectionEyebrow>VELORA — ABOUT</SectionEyebrow>
        <p className="hidden text-[10px] uppercase tracking-[0.34em] text-white/40 sm:block">
          {site.cities}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <SplitTextReveal
          as="h1"
          lines={["PIONEERING WELLNESS.", "PROVEN RESULTS."]}
          className="text-2xl font-extralight uppercase leading-[1.08] tracking-[0.08em] text-white sm:text-3xl lg:col-span-7 lg:text-[2.5rem]"
          start="top 95%"
        />
        <div data-hero-intro className="space-y-5 lg:col-span-5 lg:col-start-8 lg:pt-1">
          <p className="text-base font-light leading-[1.75] text-white/60 sm:text-lg">
            We do not bring a template to a project. We bring precision, vision,
            and the accumulated intelligence of over two decades.
          </p>
          <p className="text-base font-light leading-[1.75] text-white sm:text-lg">
            Every VELORA environment begins with a single question: what do you
            want people to feel?
          </p>
        </div>
      </div>

      <ArchitecturalReveal className="mt-12 lg:mt-16" start="top 95%" delay={0.2}>
        <GeneratedMedia
          id="video-design-process"
          className="h-[40vh] w-full sm:h-[52vh] lg:h-[60vh]"
          sizes="100vw"
          eager
        />
      </ArchitecturalReveal>

      {/* Phones: one row per figure, number left and label right. sm+: three
          columns, number over label. */}
      <dl
        data-hero-stats
        className="mt-10 border-t border-white/10 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pt-8 lg:mt-12"
      >
        {credentials.map((stat) => (
          <div
            key={stat.label}
            data-hero-stat
            className="flex items-baseline justify-between gap-4 border-b border-white/10 py-5 sm:flex-col sm:items-start sm:justify-start sm:gap-0 sm:border-0 sm:py-0"
          >
            <dt className="text-right text-[10px] uppercase tracking-[0.28em] text-white/45 sm:mt-3 sm:text-left">
              {stat.label}
            </dt>
            <dd className="order-first text-3xl font-extralight tabular-nums leading-none text-white lg:text-[2.2rem]">
              {stat.value.toLocaleString("en-US")}
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
