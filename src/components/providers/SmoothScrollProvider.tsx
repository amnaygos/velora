"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * One global Lenis instance driven by GSAP's ticker so smooth scrolling
 * and ScrollTrigger share a single clock. Disabled entirely for
 * reduced-motion users — the page then scrolls natively.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  /**
   * ScrollTrigger measures start/end positions when each chapter mounts —
   * before the pinned sections have inserted their spacers and before the
   * films and images have settled the layout. Without a refresh those
   * offsets stay stale and every entrance fires at the wrong scroll
   * position (or appears already finished). Re-measure once the page has
   * actually settled, and after anything that changes document height.
   */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(refresh);
    });

    const timers = [
      setTimeout(refresh, 400),
      setTimeout(refresh, 1500),
      setTimeout(refresh, 3000),
    ];

    window.addEventListener("load", refresh);
    window.addEventListener("velora:preloader-done", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    // Any film reaching metadata changes nothing visually but can shift
    // layout on slower connections — re-measure when they land.
    const videos = Array.from(document.querySelectorAll("video"));
    videos.forEach((v) => v.addEventListener("loadeddata", refresh));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      window.removeEventListener("velora:preloader-done", refresh);
      videos.forEach((v) => v.removeEventListener("loadeddata", refresh));
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
