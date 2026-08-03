"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type SplitTextRevealProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** ScrollTrigger start position; defaults to "top 82%". */
  start?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
};

/**
 * Text-line reveal: each line rises out of an overflow-hidden wrapper.
 * Runs once when the element enters the viewport.
 */
export function SplitTextReveal({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  start = "top 82%",
  stagger = 0.12,
  delay = 0,
  duration = 1.1,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      const targets = ref.current.querySelectorAll("[data-reveal-line]");
      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          ease: EASE,
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <span
            data-reveal-line
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
