"use client";

import { useRef, type ReactNode } from "react";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { manifestoAccents, manifestoStatements } from "@/content/site";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function renderStatementLine(line: string, accent: string): ReactNode {
  if (!line.includes(accent)) return line;
  const [before, after] = line.split(accent);
  return (
    <>
      {before}
      <span data-accent className="transition-colors duration-700">
        {accent}
      </span>
      {after}
    </>
  );
}

/**
 * Chapter 02 — the manifesto. A pinned chapter (~250vh) over the material
 * macro film; statements replace one another as the visitor scrolls, and
 * the final word ENVIRONMENTS dissolves into structural vertical lines.
 */
export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const materialsAsset = getMedia("video-materials");

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reducedMotion) return;

      const statements = gsap.utils.toArray<HTMLElement>("[data-statement]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          // Chapters gate on media queries that resolve after hydration,
          // so their triggers are created out of page order. Without an
          // explicit priority, ScrollTrigger refreshes them in the wrong
          // order and later pins mis-measure by the length of earlier
          // ones. Priorities run high → low, in document order.
          refreshPriority: 5,
        },
      });

      // One statement owns the frame at a time: the previous line has
      // fully left before the next arrives — no stacked ghosts mid-scroll.
      statements.forEach((statement, index) => {
        const at = index;
        tl.fromTo(
          statement,
          { opacity: 0, y: 70 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
          at,
        );
        const accent = statement.querySelector("[data-accent]");
        if (accent) {
          tl.to(accent, { color: "#91928d", duration: 0.15, ease: "none" }, at + 0.28);
        }
        if (index < statements.length - 1) {
          tl.to(
            statement,
            { opacity: 0, y: -50, duration: 0.3, ease: "power2.in" },
            at + 0.66,
          );
        }
      });

      // Final beat: the last statement holds, widens slightly, and the
      // structural divisions rise to hand over to the next chapter.
      const last = statements[statements.length - 1];
      tl.to(
        last,
        { scale: 1.05, duration: 0.45, ease: "none" },
        statements.length - 0.35,
      );
      tl.fromTo(
        "[data-division]",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.45, ease: EASE, stagger: 0.035 },
        statements.length - 0.25,
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (reducedMotion) {
    // Same narrative, no pinning: statements as a readable sequence.
    return (
      <section className="relative bg-carbon px-5 py-28 sm:px-8 lg:px-12">
        <SectionEyebrow>VELORA — MANIFESTO</SectionEyebrow>
        <div className="mt-16 space-y-16">
          {manifestoStatements.map((lines, i) => (
            <p
              key={i}
              className="max-w-4xl text-lg font-extralight uppercase leading-[1.15] tracking-[0.07em] text-white sm:text-xl"
            >
              {lines.join(" ")}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] overflow-hidden bg-carbon"
    >
      {/* Material macro film. It carries the chapter, so it plays at full
          strength — legibility comes from a centre-weighted scrim rather
          than from crushing the footage. */}
      <div className="absolute inset-0">
        <ResponsiveVideo asset={materialsAsset} />
      </div>

      {/* centre scrim: darkest behind the statements, clear at the edges
          where the material and its light stay visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 50%, rgba(28,28,28,0.86) 0%, rgba(28,28,28,0.72) 42%, rgba(28,28,28,0.34) 74%, rgba(28,28,28,0.18) 100%)",
        }}
      />
      {/* a light, even wash keeps contrast on the brightest frames */}
      <div aria-hidden="true" className="absolute inset-0 bg-carbon/20" />

      <div className="absolute left-5 top-24 sm:left-8 lg:left-12">
        <SectionEyebrow>VELORA — MANIFESTO</SectionEyebrow>
      </div>

      {/* structural divisions that introduce the next chapter */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex justify-between px-[8vw]"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            data-division
            className="h-full w-px origin-bottom scale-y-0 bg-white/8"
          />
        ))}
      </div>

      <div className="relative flex h-full items-center justify-center px-5 text-center sm:px-8">
        {manifestoStatements.map((lines, index) => (
          <p
            key={index}
            data-statement
            className="absolute max-w-5xl text-lg font-extralight uppercase leading-[1.12] tracking-[0.07em] text-white opacity-0 sm:text-xl"
          >
            {lines.map((line, li) => (
              <span key={li} className="block">
                {renderStatementLine(line, manifestoAccents[index])}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
