"use client";

import { useRef } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STATEMENTS = [
  {
    id: "practice",
    mediaId: "still-philosophy-movement",
    lines: ["THE SPACE", "SHAPES THE PRACTICE."],
    body: "Architecture is not a backdrop. It is the first instruction your body receives.",
  },
  {
    id: "luxury",
    mediaId: "still-philosophy-material",
    lines: ["LUXURY", "WITHOUT ANNOUNCEMENT."],
    body: "The highest quality needs no display. VELORA spaces do not perform luxury. They embody it.",
  },
] as const;

/**
 * Chapter 08 — two full-screen philosophies. The first exits left as the
 * second enters from the right past a temporary vertical divider.
 */
export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = !reducedMotion && isDesktop;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !pinned) return;

      // Arrival beat: the first statement settles in while the chapter
      // slides up toward its pin. It animates y only — the pinned
      // timeline below owns opacity and xPercent, and two animations
      // driving the same property fight on every ScrollTrigger refresh.
      gsap.fromTo(
        "[data-philosophy='practice']",
        { y: 70 },
        {
          y: 0,
          duration: 1.1,
          ease: EASE,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          refreshPriority: 1,
        },
      });

      tl.fromTo(
        "[data-philosophy-divider]",
        { scaleY: 0, opacity: 1 },
        { scaleY: 1, duration: 0.35, ease: EASE },
        0.9,
      )
        .to(
          "[data-philosophy='practice']",
          { xPercent: -36, opacity: 0, duration: 0.8, ease: "power1.inOut" },
          1.0,
        )
        .fromTo(
          "[data-philosophy='luxury']",
          { xPercent: 36, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.8, ease: "power1.inOut" },
          1.05,
        )
        .to(
          "[data-philosophy-divider]",
          { opacity: 0, duration: 0.3, ease: "none" },
          1.9,
        );
    },
    // Same hydration story as ProcessFilm: tear the pin down if `pinned`
    // flips after the first paint.
    { scope: sectionRef, dependencies: [pinned], revertOnUpdate: true },
  );

  if (!pinned) {
    return (
      <section ref={sectionRef} className="bg-carbon">
        {STATEMENTS.map((statement) => (
          <div
            key={statement.id}
            className="grid gap-10 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16"
          >
            <div>
              <h2 className="text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white">
                {statement.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65 sm:text-lg">
                {statement.body}
              </p>
            </div>
            <ResponsiveImage
              asset={getMedia(statement.mediaId)}
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-carbon">
      <div
        data-philosophy-divider
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-20 h-full w-px origin-top -translate-x-1/2 scale-y-0 bg-olive/60"
      />

      {STATEMENTS.map((statement, index) => (
        <div
          key={statement.id}
          data-philosophy={statement.id}
          className="absolute inset-0 grid grid-cols-2 items-center gap-16 px-12"
          style={index === 1 ? { opacity: 0 } : undefined}
        >
          <div className={index === 1 ? "order-2" : undefined}>
            <h2 className="text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.8rem]">
              {statement.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-10 max-w-md text-lg font-light leading-[1.7] text-white/65">
              {statement.body}
            </p>
          </div>
          <div className={index === 1 ? "order-1" : undefined}>
            <ResponsiveImage
              asset={getMedia(statement.mediaId)}
              sizes="45vw"
              className="max-h-[70vh]"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
