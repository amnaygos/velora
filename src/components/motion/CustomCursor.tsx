"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Fine architectural cursor for desktop pointers: a small circle that
 * expands over interactive elements and shows a label over elements
 * marked with data-cursor-label (e.g. "VIEW" on project media).
 * Disabled on touch devices, small screens, and for reduced motion.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const active = !isTouch && !reducedMotion && isLarge;

  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!active) {
      document.body.removeAttribute("data-velora-cursor");
      return;
    }
    document.body.setAttribute("data-velora-cursor", "true");

    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      const target = event.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      setLabel(labelled?.dataset.cursorLabel ?? null);
      setHovering(
        Boolean(
          labelled ??
            target?.closest("a, button, [role='button'], input, select, textarea, label"),
        ),
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeAttribute("data-velora-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[450] -translate-x-1/2 -translate-y-1/2"
    >
      {/* sharp architectural cursor: a small square that grows over
          interactive elements, with fine crosshair ticks */}
      <div
        className={
          "relative flex items-center justify-center border border-white/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (label
            ? "h-16 w-16 bg-carbon/70 backdrop-blur-[2px]"
            : hovering
              ? "h-7 w-7"
              : "h-2.5 w-2.5")
        }
      >
        <span className="absolute -top-1.5 left-1/2 h-1 w-px -translate-x-1/2 bg-white/50" />
        <span className="absolute -bottom-1.5 left-1/2 h-1 w-px -translate-x-1/2 bg-white/50" />
        <span className="absolute -left-1.5 top-1/2 h-px w-1 -translate-y-1/2 bg-white/50" />
        <span className="absolute -right-1.5 top-1/2 h-px w-1 -translate-y-1/2 bg-white/50" />
        {label ? (
          <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
