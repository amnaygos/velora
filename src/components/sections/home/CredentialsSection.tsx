"use client";

import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { credentials } from "@/content/site";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DISTRICTS = ["DOHA", "LUSAIL", "THE PEARL", "LONDON"];

/**
 * Chapter 05 — proof before persuasion. Numbers begin as thin outlines,
 * fill as they enter, and count exactly once over ~1.8s.
 */
export function CredentialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reducedMotion) return;

      // Arrival beat: the chapter rises to meet the services handover
      // instead of sitting flat when the pin releases.
      gsap.fromTo(
        "[data-credentials-frame]",
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: EASE,
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((stat, index) => {
        const target = Number(stat.dataset.value ?? "0");
        const numberEl = stat.querySelector<HTMLElement>("[data-stat-number]");
        if (!numberEl) return;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          delay: index * 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: stat, start: "top 80%", once: true },
          onStart: () => {
            numberEl.style.webkitTextStroke = "0px transparent";
            numberEl.style.color = "rgba(255,255,255,1)";
          },
          onUpdate: () => {
            numberEl.textContent =
              Math.round(counter.value).toLocaleString("en-US") +
              (stat.dataset.suffix ?? "");
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-carbon px-5 py-32 sm:px-8 lg:px-12 lg:py-44"
      aria-label="Credentials"
    >
      <div data-credentials-frame>
      <SectionEyebrow>PROOF BEFORE PERSUASION</SectionEyebrow>

      <div className="mt-20 grid gap-16 sm:grid-cols-3 sm:gap-8">
        {credentials.map((stat) => (
          <div
            key={stat.label}
            data-stat
            data-value={stat.value}
            data-suffix={stat.suffix}
          >
            <p
              data-stat-number
              className="text-2xl font-extralight tabular-nums leading-none sm:text-3xl lg:text-[2.2rem]"
              style={
                reducedMotion
                  ? { color: "rgba(255,255,255,1)" }
                  : {
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(255,255,255,0.4)",
                    }
              }
            >
              {stat.value.toLocaleString("en-US")}
              {stat.suffix}
            </p>
            {/* fine measurement marks */}
            <div
              aria-hidden="true"
              className="mt-6 flex h-2 items-end gap-[7px]"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i % 6 === 0 ? "h-2 w-px bg-white/30" : "h-1 w-px bg-white/15"
                  }
                />
              ))}
            </div>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* one line drawn through the districts VELORA has built in */}
      <div className="mt-24 flex items-center gap-4 sm:gap-6">
        <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
        {DISTRICTS.map((district, index) => (
          <span key={district} className="flex items-center gap-4 sm:gap-6">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 border border-olive/80"
              />
            ) : null}
            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/70 sm:text-[11px] sm:tracking-[0.34em]">
              {district}
            </span>
          </span>
        ))}
        <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
      </div>
      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.34em] text-white/35">
        QATAR & THE UNITED KINGDOM
      </p>
      </div>
    </section>
  );
}
