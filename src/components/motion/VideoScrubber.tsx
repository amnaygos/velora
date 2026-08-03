"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useScrollVideo } from "@/hooks/useScrollVideo";

type VideoScrubberProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  enabled?: boolean;
};

/**
 * Maps a trigger element's scroll progress onto a video's currentTime
 * with rAF smoothing. Renders nothing.
 */
export function VideoScrubber({
  videoRef,
  triggerRef,
  start = "top top",
  end = "bottom bottom",
  enabled = true,
}: VideoScrubberProps) {
  const progressRef = useRef(0);

  useEffect(() => {
    if (!enabled || !triggerRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [enabled, triggerRef, start, end]);

  useScrollVideo(videoRef, progressRef, enabled);

  return null;
}
