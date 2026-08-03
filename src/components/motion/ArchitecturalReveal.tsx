"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ArchitecturalRevealProps = {
  children: ReactNode;
  className?: string;
  /** Direction the mask opens from. */
  direction?: "bottom" | "top" | "left" | "right";
  start?: string;
  delay?: number;
  /** Also apply the material scale/brightness settle to the inner content. */
  material?: boolean;
};

const CLIP_FROM: Record<string, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Architectural mask reveal: content is unveiled through a hard-edged
 * clip-path, optionally settling from an oversized, darkened state.
 */
export function ArchitecturalReveal({
  children,
  className,
  direction = "bottom",
  start = "top 78%",
  delay = 0,
  material = true,
}: ArchitecturalRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      const inner = ref.current.querySelector("[data-reveal-inner]");
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
      tl.fromTo(
        ref.current,
        { clipPath: CLIP_FROM[direction] },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE },
      );
      if (material && inner) {
        tl.fromTo(
          inner,
          { scale: 1.12, filter: "brightness(0.55)" },
          { scale: 1, filter: "brightness(0.82)", duration: 1.6, ease: EASE },
          0,
        );
      }
    },
    { scope: ref, dependencies: [reducedMotion, direction] },
  );

  return (
    <div ref={ref} className={cn("will-change-[clip-path]", className)}>
      <div data-reveal-inner className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
