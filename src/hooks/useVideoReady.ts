"use client";

import { useEffect, useState, type RefObject } from "react";

export function useVideoReady(
  videoRef: RefObject<HTMLVideoElement | null>,
): { ready: boolean; failed: boolean } {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

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
  }, [videoRef]);

  return { ready, failed };
}
