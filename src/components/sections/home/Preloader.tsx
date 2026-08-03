"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/content/site";
import { VeloraMark } from "@/components/brand/VeloraMark";

export const PRELOADER_DONE_EVENT = "velora:preloader-done";

function markReady() {
  document.documentElement.dataset.veloraReady = "true";
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}

/**
 * Chapter 00 — restrained preloader. Preloads only the hero poster and
 * fonts, counts 00 → 100, splits the V, and reveals the page. Repeat
 * visits (same session) get a much shorter reveal.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const revisit = sessionStorage.getItem("velora-visited") === "true";
    sessionStorage.setItem("velora-visited", "true");

    document.documentElement.style.overflow = "hidden";
    const cleanup = () => {
      document.documentElement.style.overflow = "";
    };

    const finish = (fast: boolean) => {
      setProgress(100);
      const root = rootRef.current;
      if (!root || reducedMotion || fast) {
        markReady();
        setVisible(false);
        cleanup();
        return;
      }
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          cleanup();
        },
      });
      tl.to("[data-preloader-meta]", { opacity: 0, duration: 0.4, ease: EASE })
        .add(markReady, 0.15)
        .to(
          "[data-preloader-v-left]",
          { xPercent: -140, opacity: 0, duration: 0.9, ease: "power4.inOut" },
          0.1,
        )
        .to(
          "[data-preloader-v-right]",
          { xPercent: 140, opacity: 0, duration: 0.9, ease: "power4.inOut" },
          0.1,
        )
        .to(root, { opacity: 0, duration: 0.5, ease: EASE }, 0.6);
    };

    if (revisit) {
      // Short reveal on repeat visits — no fake loading.
      const t = setTimeout(() => finish(true), 250);
      return () => {
        clearTimeout(t);
        cleanup();
      };
    }

    // Real readiness: fonts + hero poster; progress is display only.
    let value = 0;
    const ticker = setInterval(() => {
      value = Math.min(92, value + Math.max(1, Math.round((92 - value) / 9)));
      setProgress(value);
    }, 90);

    const poster = new Image();
    poster.src = "/media/posters/video-hero.webp";
    const posterReady = new Promise<void>((resolve) => {
      poster.onload = () => resolve();
      poster.onerror = () => resolve();
    });
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 3200));

    Promise.race([
      Promise.all([document.fonts.ready.then(() => undefined), posterReady]),
      timeout,
    ]).then(() => {
      clearInterval(ticker);
      finish(false);
    });

    return () => {
      clearInterval(ticker);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading VELORA"
      className="fixed inset-0 z-[350] flex flex-col items-center justify-center bg-carbon"
    >
      <div
        className="relative h-[32vh] max-h-[320px] select-none text-white/55"
        aria-hidden="true"
      >
        <VeloraMark
          outline
          data-preloader-v-left
          className="h-full w-auto"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
        <VeloraMark
          outline
          data-preloader-v-right
          className="absolute inset-0 h-full w-auto"
          style={{ clipPath: "inset(0 0 0 50%)" }}
        />
      </div>

      <div data-preloader-meta className="mt-10 w-56 sm:w-72">
        <div className="h-px w-full bg-white/10">
          <div
            className="h-px bg-olive transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
            {site.cities}
          </span>
          <span className="text-[10px] tabular-nums tracking-[0.28em] text-white/60">
            {String(Math.round(progress)).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
