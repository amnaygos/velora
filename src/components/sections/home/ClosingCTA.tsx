"use client";

import { useRef } from "react";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Chapter 11 — the closing film. The space darkens as the visitor
 * approaches the footer until only one line of light remains, visually
 * aligned with the footer divider.
 */
export function ClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const closing = getMedia("video-closing");

  useGSAP(
    () => {
      if (!sectionRef.current || reducedMotion) return;
      gsap.to("[data-closing-veil]", {
        opacity: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-carbon"
    >
      <div className="absolute inset-0">
        <ResponsiveVideo asset={closing} />
      </div>
      <div
        data-closing-veil
        aria-hidden="true"
        className="absolute inset-0 bg-carbon/55"
      />

      <div className="relative z-10 w-full px-5 py-32 sm:px-8 lg:px-12">
        <h2 className="text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.95rem]">
          READY
          <br />
          TO BEGIN?
        </h2>
        <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/70 sm:text-lg">
          Your vision deserves an environment equal to it.
        </p>
        <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <ButtonLink href="/contact" transitionLabel="VELORA — CONTACT">
            REQUEST A CONSULTATION
          </ButtonLink>
          <TextLink
            href="/portfolio"
            transitionLabel="VELORA — PORTFOLIO"
            withArrow={false}
          >
            VIEW OUR WORK
          </TextLink>
        </div>
      </div>
      {/* No closing rule here: the footer's own divider is the single line
          the darkened film hands over to. */}
    </section>
  );
}
