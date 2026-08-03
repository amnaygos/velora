"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { MediaAsset } from "@/types/media";
import { MediaPoster } from "@/components/media/MediaPoster";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ResponsiveVideoProps = {
  asset: MediaAsset;
  className?: string;
  /** Autoplay as a muted loop (default). Set false for scrubbed videos. */
  autoPlay?: boolean;
  /** Preload behavior; the homepage hero uses "auto". */
  preload?: "none" | "metadata" | "auto";
  /** Pause playback while off screen (default true). */
  pauseOffscreen?: boolean;
};

/**
 * Local video element with desktop/mobile source selection, poster
 * loading state, error fallback, off-screen pausing, and a reduced-motion
 * poster fallback. All sources are local files in /public/media.
 */
export const ResponsiveVideo = forwardRef<
  HTMLVideoElement | null,
  ResponsiveVideoProps
>(function ResponsiveVideo(
  { asset, className, autoPlay = true, preload = "metadata", pauseOffscreen = true },
  outerRef,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(outerRef, () => videoRef.current as HTMLVideoElement);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const src = isMobile && asset.mobileSrc ? asset.mobileSrc : asset.src;
  const webm = isMobile && asset.mobileWebmSrc ? asset.mobileWebmSrc : asset.webmSrc;

  // Local/cached videos often finish loading BEFORE React attaches the
  // onLoadedData handler, so that event is missed and the element would stay
  // stuck at opacity-0 (invisible). Check readyState on mount and also listen
  // for canplay as a backstop, so `ready` reliably flips to true.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    const onError = () => setFailed(true);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !pauseOffscreen || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!autoPlay) return;
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlay, pauseOffscreen, reducedMotion, src]);

  if (reducedMotion || failed || !src) {
    return <MediaPoster asset={asset} className={cn("h-full w-full", className)} />;
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-shadow", className)}>
      <video
        ref={videoRef}
        key={src}
        muted
        playsInline
        loop={autoPlay}
        autoPlay={autoPlay}
        preload={preload}
        poster={asset.poster}
        aria-label={asset.alt}
        onLoadedData={() => setReady(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
      {!ready ? (
        <MediaPoster asset={asset} className="absolute inset-0" />
      ) : null}
    </div>
  );
});
