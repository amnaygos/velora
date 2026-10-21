"use client";

import { useRef } from "react";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { VeloraWordmark } from "@/components/brand/VeloraWordmark";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";
import { useStudio } from "@/components/providers/StudioProvider";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Footer() {
  const studio = useStudio();
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      tl.fromTo(
        "[data-footer-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: EASE },
      )
        .fromTo(
          "[data-footer-wordmark]",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE },
          0.2,
        )
        .fromTo(
          "[data-footer-item]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.06 },
          0.5,
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <footer ref={ref} className="relative bg-carbon px-5 pb-10 pt-20 sm:px-8 lg:px-12">
      {/* The closing film's final line of light lands on this divider. */}
      <div
        id="footer-divider"
        data-footer-rule
        className="h-px w-full origin-left bg-olive/50"
      />

      <div
        data-footer-wordmark
        aria-hidden="true"
        className="mt-14 select-none text-white/90"
      >
        <VeloraWordmark className="h-auto w-full" />
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-3">
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {footerNav.map((item) => (
              <li key={item.href} data-footer-item>
                <TransitionLink
                  href={item.href}
                  transitionLabel={item.transitionLabel}
                  className="text-[11px] uppercase tracking-[0.2em] text-white/55 transition-colors duration-500 hover:text-white"
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4" data-footer-item>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
            STUDIO
          </p>
          <p className="text-[11px] uppercase leading-loose tracking-[0.2em] text-white/55">
            {site.cities}
          </p>
          {studio.email ? (
            <a
              href={`mailto:${studio.email}`}
              className="block text-[11px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-500 hover:text-white"
            >
              {studio.email.toUpperCase()}
            </a>
          ) : null}
        </div>

        {studio.socials.length ? (
        <div className="space-y-4" data-footer-item>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
            FOLLOW
          </p>
          <ul className="space-y-3">
            {studio.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-[0.2em] text-white/55 transition-colors duration-500 hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        ) : null}
      </div>

      <div
        data-footer-item
        className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© VELORA {site.copyrightYear}</p>
        <div className="flex gap-8">
          <span>PRIVACY</span>
          <span>TERMS</span>
        </div>
      </div>
    </footer>
  );
}
