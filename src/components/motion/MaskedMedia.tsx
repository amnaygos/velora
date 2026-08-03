"use client";

import type { ReactNode } from "react";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";

/**
 * Convenience wrapper: media revealed through an architectural mask
 * without the material scale settle (used for wordmarks and text blocks).
 */
export function MaskedMedia({
  children,
  className,
  direction = "bottom",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "bottom" | "top" | "left" | "right";
  delay?: number;
}) {
  return (
    <ArchitecturalReveal
      className={className}
      direction={direction}
      delay={delay}
      material={false}
    >
      {children}
    </ArchitecturalReveal>
  );
}
