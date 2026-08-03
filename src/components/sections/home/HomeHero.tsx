"use client";

import { useRef } from "react";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { VeloraWordmark } from "@/components/brand/VeloraWordmark";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { PRELOADER_DONE_EVENT } from "@/components/sections/home/Preloader";
import { pillarLead, pillarsSecondary } from "@/content/pillars";
import { site } from "@/content/site";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Chapter 01 — the hero. Begins nearly black; a vertical slit reveals
 * the film, the wordmark surfaces through a mask, and scroll pushes the
 * whole frame toward the manifesto through a growing central line.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const heroAsset = getMedia("video-hero");

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      if (reducedMotion) return;

      // — Entrance choreography (plays once the preloader releases)
      const entrance = gsap.timeline({ paused: true });
      entrance
        .fromTo(
          "[data-hero-media]",
          { clipPath: "inset(0% 46% 0% 46%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power4.inOut" },
        )
        .fromTo(
          "[data-hero-wordmark] [data-reveal]",
          { yPercent: 112 },
          { yPercent: 0, duration: 1.2, ease: EASE },
          "-=0.7",
        )
        .fromTo(
          "[data-hero-tagline] [data-reveal]",
          { yPercent: 112, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: EASE, stagger: 0.14 },
          "-=0.6",
        )
        .fromTo(
          "[data-hero-label]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.1 },
          "-=0.4",
        );

      if (document.documentElement.dataset.veloraReady === "true") {
        entrance.play();
      } else {
        const onReady = () => entrance.play();
        window.addEventListener(PRELOADER_DONE_EVENT, onReady, { once: true });
        // Safety: never leave the hero unrevealed.
        gsap.delayedCall(4.5, () => {
          if (entrance.progress() === 0) entrance.play();
        });
      }

      // — Scroll choreography
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      scrollTl
        .to("[data-hero-media-inner]", { scale: 1.08, ease: "none" }, 0)
        .to("[data-hero-veil]", { opacity: 0.85, ease: "none" }, 0)
        .to(
          "[data-hero-wordmark]",
          { scaleX: 1.06, transformOrigin: "50% 50%", ease: "none" },
          0,
        )
        .to("[data-hero-tagline]", { opacity: 0, ease: "none" }, 0)
        .to("[data-hero-label]", { opacity: 0, ease: "none" }, 0)
        .fromTo(
          "[data-hero-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none" },
          0.35,
        );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] overflow-hidden bg-carbon"
      aria-label="VELORA — Where Wellness Meets Wonder"
    >
      {/* 1 — film */}
      <div
        data-hero-media
        className="absolute inset-0"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div data-hero-media-inner className="h-full w-full will-change-transform">
          <ResponsiveVideo asset={heroAsset} preload="auto" />
        </div>
      </div>

      {/* 2 — deep carbon veil, 3 — vignette */}
      <div data-hero-veil className="absolute inset-0 bg-carbon/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* central line that carries the eye into the manifesto */}
      <div
        data-hero-line
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[38vh] w-px origin-bottom -translate-x-1/2 scale-y-0 bg-olive/70"
      />

      {/* 6/7 — wordmark and the three offering pillars */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <h1 className="sr-only">
          VELORA — Where Wellness Meets Wonder. Premium wellness design-build
          studio in Doha and London. Private and residential, commercial and
          hospitality, and business consultancy.
        </h1>
        <div data-hero-wordmark aria-hidden="true" className="overflow-hidden">
          <div data-reveal className="will-change-transform">
            <VeloraWordmark className="h-auto w-[82vw] max-w-[1100px] text-white sm:w-[68vw]" />
          </div>
        </div>

        {/* offering pillars — the lead set large, the other two flanking */}
        <div
          data-hero-tagline
          className="mt-7 flex w-full max-w-3xl flex-col items-center sm:mt-9"
        >
          <span className="block overflow-hidden">
            <TransitionLink
              href={pillarLead.href}
              transitionLabel={pillarLead.transitionLabel}
              data-reveal
              className="block text-base font-extralight uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:text-olive sm:text-lg lg:text-[1.45rem]"
            >
              {pillarLead.title.join(" ")}
            </TransitionLink>
          </span>

          <div className="mt-5 flex w-full items-start justify-center gap-8 sm:mt-7 sm:justify-between sm:gap-16">
            {pillarsSecondary.map((pillar, index) => (
              <span key={pillar.href + index} className="block overflow-hidden">
                <TransitionLink
                  href={pillar.href}
                  transitionLabel={pillar.transitionLabel}
                  data-reveal
                  className={cn(
                    "block text-[11px] font-light uppercase leading-[1.4] tracking-[0.22em] text-white/70 transition-colors duration-500 hover:text-white sm:text-sm lg:text-base",
                    index === 1 ? "text-right" : "text-left",
                  )}
                >
                  {pillar.title.join(" ")}
                </TransitionLink>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 8 — corner labels */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-8 sm:px-8 lg:px-12">
        <p
          data-hero-label
          className="text-[10px] uppercase tracking-[0.28em] text-white/50"
        >
          {site.lifecycle}
        </p>
        <p
          data-hero-label
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/50"
        >
          {site.scrollLabel}
          <span aria-hidden="true" className="animate-bounce text-white/70">
            ↓
          </span>
        </p>
      </div>
    </section>
  );
}
