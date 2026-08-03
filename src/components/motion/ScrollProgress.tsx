"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * An olive progress line that fills as its nearest positioned ancestor
 * section scrolls through the viewport.
 */
export function ScrollProgress({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      const section = ref.current.closest("section") ?? ref.current.parentElement;
      if (!section) return;
      if (reducedMotion) {
        gsap.set(ref.current, { [vertical ? "scaleY" : "scaleX"]: 1 });
        return;
      }
      gsap.fromTo(
        ref.current,
        { [vertical ? "scaleY" : "scaleX"]: 0 },
        {
          [vertical ? "scaleY" : "scaleX"]: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 40%",
            scrub: 0.6,
          },
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
        "bg-olive",
        vertical ? "w-px origin-top" : "h-px origin-left",
        className,
      )}
    />
  );
}
