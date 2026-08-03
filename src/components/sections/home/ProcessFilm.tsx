"use client";

import { useRef } from "react";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STAGES = [
  {
    id: "vision",
    mediaId: "video-design-process",
    title: "VISION",
    lines: ["WHAT SHOULD PEOPLE FEEL?"],
  },
  {
    id: "authorship",
    mediaId: "video-build-precision",
    title: "AUTHORSHIP",
    lines: ["EVERY DECISION BELONGS", "TO THE SAME IDEA."],
  },
  {
    id: "continuity",
    mediaId: "video-day-1001",
    title: "CONTINUITY",
    lines: ["THE STANDARD DOES NOT END", "AT HANDOVER."],
  },
] as const;

const PROGRESS_WORDS = ["VISION", "DESIGN", "BUILD", "SUSTAIN"] as const;

/**
 * Chapter 07 — Vision, Build, Sustain. A pinned three-stage cinematic
 * sequence: the drawn line match-cuts into construction, construction
 * into operations, while the anchored text and progress line advance.
 * Touch and reduced-motion visitors get a vertical sequence of
 * controlled loops instead of pinning.
 */
export function ProcessFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();
  const pinned = !reducedMotion && !isTouch;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !pinned) return;

      // Entry: as the chapter slides up toward its pin, the frame opens
      // from a narrower band, so the pin engages on an already-composed
      // image instead of a hard cut. Only clip-path is animated here —
      // the stage text belongs solely to the pinned timeline below, or
      // the two would fight over opacity on every ScrollTrigger refresh.
      // Entrance. Every property here lives on its own element, so none
      // of it collides with the pinned timeline (which owns the stage
      // text's opacity and the frame's opacity).
      const entry = {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        refreshPriority: 2,
      };

      // 1 — the film rises out of carbon rather than cutting in
      gsap.fromTo(
        "[data-process-veil]",
        { opacity: 1 },
        { opacity: 0, ease: "power2.out", scrollTrigger: entry },
      );
      // 2 — and settles from a slow push-in
      gsap.fromTo(
        "[data-process-zoom]",
        { scale: 1.14 },
        { scale: 1, ease: "none", scrollTrigger: entry },
      );
      // 3 — the VISION block lifts into place. This wraps the stage stack,
      //     so the timeline still owns each stage's own opacity beneath it.
      gsap.fromTo(
        "[data-process-intro]",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: { ...entry, start: "top 78%" },
        },
      );
      // 4 — the progress rail draws itself in
      gsap.fromTo(
        "[data-process-rail]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: { ...entry, start: "top 70%" },
        },
      );

      // Exactly one stage owns the frame at a time.
      gsap.set("[data-stage-text='0']", { opacity: 1, y: 0 });
      gsap.set("[data-stage-text='1'], [data-stage-text='2']", {
        opacity: 0,
        y: 34,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=330%",
          pin: true,
          scrub: 1,
          refreshPriority: 2,
        },
      });

      // Sequence per handover: the outgoing text clears first, the film
      // wipes through, and only then does the incoming text settle.
      STAGES.forEach((_, index) => {
        if (index === 0) return;
        const at = index;
        tl.to(
          `[data-stage-text='${index - 1}']`,
          { opacity: 0, y: -24, duration: 0.22, ease: "power2.in" },
          at - 0.36,
        )
          .fromTo(
            `[data-stage-media='${index}']`,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.5,
              ease: "power3.inOut",
            },
            at - 0.3,
          )
          .fromTo(
            `[data-stage-text='${index}']`,
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 0.38, ease: EASE },
            at - 0.05,
          );
      });

      tl.fromTo(
        "[data-process-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: STAGES.length },
        0,
      );

      PROGRESS_WORDS.forEach((_, i) => {
        tl.to(
          `[data-process-word='${i}']`,
          { color: "rgba(255,255,255,0.95)", duration: 0.2, ease: "none" },
          (i * (STAGES.length - 0.4)) / (PROGRESS_WORDS.length - 1),
        );
      });

      // Release beat: the chapter dims and lifts through the final
      // stretch of the pin, handing over to the philosophy statements.
      tl.to(
        "[data-process-frame]",
        { opacity: 0.2, yPercent: -6, duration: 0.45, ease: "power1.in" },
        STAGES.length,
      );
    },
    { scope: sectionRef, dependencies: [pinned] },
  );

  if (!pinned) {
    return (
      <section className="bg-carbon">
        {STAGES.map((stage) => (
          <div key={stage.id} className="relative">
            <div className="relative h-[70vh] overflow-hidden">
              <ResponsiveVideo asset={getMedia(stage.mediaId)} />
              <div className="absolute inset-0 bg-carbon/55" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
                  {stage.title}
                </p>
                <p className="mt-3 text-lg font-extralight uppercase leading-[1.15] tracking-[0.07em] text-white sm:text-xl">
                  {stage.lines.join(" ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-carbon">
      <div data-process-frame className="absolute inset-0 will-change-transform">
      <div data-process-zoom className="absolute inset-0 will-change-transform">
      {/* stacked films */}
      {STAGES.map((stage, index) => (
        <div
          key={stage.id}
          data-stage-media={index}
          className="absolute inset-0"
          style={index > 0 ? { clipPath: "inset(0% 0% 0% 100%)" } : undefined}
        >
          <ResponsiveVideo asset={getMedia(stage.mediaId)} />
          <div className="absolute inset-0 bg-carbon/55" />
        </div>
      ))}

      {/* carbon the chapter emerges from on entry */}
      <div
        data-process-veil
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-carbon"
      />

      {/* anchored text — the intro wrapper carries the entrance, so each
          stage below keeps its own opacity under the pinned timeline */}
      <div className="absolute inset-0 z-20 flex items-center px-5 sm:px-8 lg:px-12">
        <div
          data-process-intro
          className="relative h-48 w-full max-w-3xl will-change-transform"
        >
          {STAGES.map((stage, index) => (
            <div
              key={stage.id}
              data-stage-text={index}
              className="absolute inset-0"
              style={index > 0 ? { opacity: 0 } : undefined}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
                {stage.title}
              </p>
              <p className="mt-5 text-lg font-extralight uppercase leading-[1.1] tracking-[0.08em] text-white sm:text-xl">
                {stage.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* progress line */}
      <div
        data-process-rail
        className="absolute inset-x-5 bottom-10 z-20 sm:inset-x-8 lg:inset-x-12"
      >
        <div className="flex justify-between pb-4">
          {PROGRESS_WORDS.map((word, i) => (
            <span
              key={word}
              data-process-word={i}
              className="text-[10px] uppercase tracking-[0.28em] text-white/30"
            >
              {word}
            </span>
          ))}
        </div>
        <div className="h-px w-full bg-white/15">
          <div
            data-process-progress
            className="h-px origin-left scale-x-0 bg-olive"
          />
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
