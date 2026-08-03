"use client";

import { useRef } from "react";
import type { MediaAsset } from "@/types/media";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { VideoScrubber } from "@/components/motion/VideoScrubber";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A tall scroll chapter with a sticky full-viewport video whose playback
 * follows scroll. On touch devices and for reduced motion it degrades to
 * a controlled autoplay loop / poster instead of scrubbing.
 */
export function ScrollVideo({
  asset,
  heightClassName = "h-[250vh]",
  className,
  children,
}: {
  asset: MediaAsset;
  heightClassName?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const scrubbing = !isTouch && !reducedMotion;

  return (
    <div ref={sectionRef} className={cn("relative", heightClassName, className)}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <ResponsiveVideo
          ref={videoRef}
          asset={asset}
          autoPlay={!scrubbing}
          preload="metadata"
        />
        {children}
      </div>
      <VideoScrubber
        videoRef={videoRef}
        triggerRef={sectionRef}
        enabled={scrubbing}
      />
    </div>
  );
}
