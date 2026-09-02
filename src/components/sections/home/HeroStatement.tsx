"use client";

import { Fragment } from "react";
import { heroStatement } from "@/content/pillars";
import { cn } from "@/lib/utils";

/**
 * The hero statement.
 *
 * Every word is its own masked line so the entrance can rise them in sequence
 * (the parent hero timeline drives it via [data-statement-word]).
 *
 * The two offering phrases are marked [data-statement-hl]. Each carries two
 * painted background layers, both driven by CSS custom properties so GSAP can
 * tween them:
 *   --rule   an olive underline that draws left → right
 *   --sweep  a soft olive wash that travels across the phrase once it lands
 * `box-decoration-break: clone` keeps both correct when a phrase wraps lines.
 *
 * The wash is a 70%-wide layer positioned by percentage, and percentage
 * positions scale with the *leftover* space (30% of the box), not the box
 * itself. So the resting positions are deliberately extreme: −250% parks the
 * layer entirely off the left edge, 340% entirely off the right — nothing is
 * painted behind the phrase until the sweep actually runs.
 */
export function HeroStatement({ className }: { className?: string }) {
  return (
    <p
      data-hero-statement
      className={cn(
        "mx-auto max-w-[46ch] text-[13px] font-extralight leading-[2] tracking-[0.06em] text-white/55 sm:max-w-[64ch] sm:text-[15px] lg:text-base",
        className,
      )}
    >
      {heroStatement.map((segment, si) => {
        const words = segment.text.split(" ").filter(Boolean);
        // Preserve the spaces that sat at a segment's edges.
        const padLeft = segment.text.startsWith(" ");
        const padRight = segment.text.endsWith(" ");

        const rendered = words.map((word, wi) => (
          <Fragment key={`${si}-${wi}`}>
            {/* the mask is padded then pulled back, so descenders (g, p, y)
                have room to travel without being clipped */}
            <span className="inline-block overflow-hidden pb-[0.2em] align-bottom -mb-[0.2em]">
              <span
                data-statement-word
                className="inline-block will-change-transform"
              >
                {word}
              </span>
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        ));

        if (!segment.highlight) {
          return (
            <Fragment key={si}>
              {padLeft ? " " : null}
              {rendered}
              {padRight ? " " : null}
            </Fragment>
          );
        }

        return (
          <Fragment key={si}>
            {padLeft ? " " : null}
            <span
              data-statement-hl
              className="relative font-light text-white"
              style={
                {
                  "--rule": "0%",
                  "--sweep": "-250%",
                  backgroundImage:
                    "linear-gradient(var(--color-olive), var(--color-olive)), " +
                    "linear-gradient(90deg, transparent 0%, rgba(145,146,141,0.30) 45%, transparent 100%)",
                  backgroundRepeat: "no-repeat, no-repeat",
                  // underline clears the descenders; wash rides behind the text
                  backgroundPosition: "0 calc(100% - 1px), var(--sweep) 0",
                  backgroundSize: "var(--rule) 1px, 70% 100%",
                  paddingBottom: "0.34em",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                } as React.CSSProperties
              }
            >
              {rendered}
            </span>
            {padRight ? " " : null}
          </Fragment>
        );
      })}
    </p>
  );
}
