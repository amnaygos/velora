"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Renders `fallback` for reduced-motion users, `children` otherwise.
 * On the server it renders `children`; the swap happens after hydration.
 */
export function ReducedMotionFallback({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return <>{reducedMotion ? fallback : children}</>;
}
