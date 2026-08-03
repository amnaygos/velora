import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** The single VELORA easing character: slow, weighty, precise. */
export const VELORA_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** GSAP equivalent of the VELORA ease. */
export const EASE = "power4.out";

export { gsap, ScrollTrigger, useGSAP };
