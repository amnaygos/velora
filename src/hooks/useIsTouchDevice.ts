"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export function useIsTouchDevice(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
