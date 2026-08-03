"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A thin architectural rule that draws itself from the left (or top)
 * when it enters the viewport.
 */
export function ArchitecturalRule({
  className,
  vertical = false,
  start = "top 88%",
  delay = 0,
}: {
  className?: string;
  vertical?: boolean;
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { [vertical ? "scaleY" : "scaleX"]: 0 },
        {
          [vertical ? "scaleY" : "scaleX"]: 1,
          duration: 1.4,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion, vertical] },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "bg-white/15",
        vertical ? "w-px origin-top" : "h-px w-full origin-left",
        className,
      )}
    />
  );
}
