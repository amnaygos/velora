"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Smoothly scrubs a video's currentTime toward `progressRef.current * duration`.
 * The caller owns the ScrollTrigger that writes into progressRef; this hook
 * only handles the requestAnimationFrame smoothing loop and pauses it when
 * the video leaves the viewport.
 */
export function useScrollVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progressRef: RefObject<number>,
  enabled: boolean,
): void {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let current = 0;
    let inView = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(video);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!inView || !video.duration || Number.isNaN(video.duration)) return;
      const target = (progressRef.current ?? 0) * video.duration;
      current += (target - current) * 0.12;
      // Avoid excessive currentTime writes for imperceptible deltas.
      if (Math.abs(video.currentTime - current) > 1 / 60) {
        video.currentTime = current;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef, progressRef, enabled]);
}
