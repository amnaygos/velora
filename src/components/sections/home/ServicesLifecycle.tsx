"use client";

import { useRef } from "react";
import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { lifecycleWords, services } from "@/content/services";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Chapter 04 — the eight disciplines as one lifecycle. Desktop pins the
 * chapter and converts vertical scroll into a horizontal sequence; on
 * mobile the same content is a vertical lifecycle with one continuous
 * progress line. Motion is disabled entirely for reduced motion.
 */
export function ServicesLifecycle() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const horizontal = isDesktop && !reducedMotion;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || !horizontal) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      // One pinned timeline: the horizontal movement, then a short
      // release beat — the chapter dims and lifts before it unpins, so
      // the handover to the next section reads as a cut, not a freeze.
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        duration: 12,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });
      // Release: once the last discipline lands, a carbon veil rises over
      // the chapter while its content lifts away — the next section then
      // emerges out of that darkness instead of simply appearing.
      tl.add(move, 0)
        .to(
          "[data-services-frame]",
          { yPercent: -8, duration: 1.4, ease: "power1.in" },
          12,
        )
        .fromTo(
          "[data-services-veil]",
          { yPercent: 100 },
          { yPercent: 0, duration: 1.4, ease: "power2.inOut" },
          12,
        );

      // Per-panel choreography driven by the horizontal container motion.
      gsap.utils.toArray<HTMLElement>("[data-service-panel]").forEach((panel) => {
        const media = panel.querySelector("[data-service-media]");
        const number = panel.querySelector("[data-service-number]");
        if (media) {
          gsap.fromTo(
            media,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: EASE,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: move,
                start: "left 85%",
                once: true,
              },
            },
          );
        }
        if (number) {
          gsap.fromTo(
            number,
            { xPercent: 24 },
            {
              xPercent: -24,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: move,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });

      // Olive progress line across the pinned chapter.
      gsap.fromTo(
        "[data-service-progress]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [horizontal] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-carbon lg:max-h-[100dvh] lg:pb-16"
    >
      <div data-services-frame>
      {/* While pinned, header + track + progress line must all fit inside
          one viewport — heights below are budgeted for that. */}
      <div className="px-5 pt-24 sm:px-8 lg:px-12">
        <SectionEyebrow>VELORA — SERVICES</SectionEyebrow>
        <h2 className="mt-8 max-w-4xl text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:mt-6 lg:text-[1.85rem]">
          EVERY DISCIPLINE.
          <br />
          ONE STANDARD.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-16 flex flex-col gap-24 px-5 pb-24 sm:px-8 lg:mt-10 lg:h-[54vh] lg:flex-row lg:items-stretch lg:gap-0 lg:px-0 lg:pb-0"
      >
        {services.map((service) => (
          <article
            key={service.index}
            data-service-panel
            className="relative flex flex-col gap-8 border-white/10 lg:w-[68vw] lg:shrink-0 lg:flex-row lg:items-center lg:gap-12 lg:border-l lg:px-14"
          >
            <div className="relative z-10 lg:w-[38%]">
              <span
                data-service-number
                aria-hidden="true"
                className="block text-[1.7rem] font-extralight leading-none text-white/12 lg:text-[2.5rem]"
              >
                {service.index}
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-olive">
                {service.discipline}
              </p>
              <h3 className="mt-4 text-lg font-extralight uppercase tracking-[0.07em] text-white">
                {service.title}
              </h3>
              <p className="mt-5 max-w-sm text-sm font-light leading-[1.7] text-white/65 lg:text-base">
                “{service.summary}”
              </p>
              <span
                aria-hidden="true"
                className="mt-8 block h-px w-24 bg-white/20"
              />
            </div>
            <div
              data-service-media
              className="lg:w-[62%]"
              style={{ willChange: "clip-path" }}
            >
              <GeneratedMedia
                id={service.mediaId}
                className="max-h-[46vh] w-full lg:max-h-[48vh]"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </article>
        ))}

        {/* Closing panel of the lifecycle */}
        <div className="flex flex-col justify-center gap-10 lg:w-[52vw] lg:shrink-0 lg:border-l lg:border-white/10 lg:px-14">
          <p className="space-y-1 text-lg font-extralight uppercase leading-[1.15] tracking-[0.07em] text-white sm:text-xl">
            {lifecycleWords.map((word, i) => (
              <span key={word} className="block">
                <span className="mr-4 text-[10px] tracking-[0.3em] text-olive align-middle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {word}
              </span>
            ))}
          </p>
          <TextLink href="/services" transitionLabel="VELORA — SERVICES">
            EXPLORE ALL SERVICES
          </TextLink>
        </div>
      </div>

      <div
        data-service-progress
        aria-hidden="true"
        className="absolute bottom-8 left-5 right-5 hidden h-px origin-left scale-x-0 bg-olive/70 sm:left-8 sm:right-8 lg:left-12 lg:right-12 lg:block"
      />
      </div>

      {/* carbon veil that closes the chapter, topped by one olive line */}
      {horizontal ? (
        <div
          data-services-veil
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 translate-y-full bg-carbon"
        >
          <span className="absolute inset-x-0 top-0 h-px bg-olive/70" />
        </div>
      ) : null}
    </section>
  );
}
