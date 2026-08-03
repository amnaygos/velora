"use client";

import { motion } from "framer-motion";
import { VELORA_EASE } from "@/lib/gsap";

/**
 * The visual layer of the route transition: a carbon panel that rises
 * from the bottom, shows the destination label, and exits upward.
 */
export function PageTransition({ label }: { label: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-end bg-carbon"
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.65, ease: VELORA_EASE }}
      aria-hidden="true"
    >
      <div className="w-full px-5 pb-10 sm:px-8 lg:px-12">
        <motion.div
          className="h-px w-full origin-left bg-olive/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: VELORA_EASE, delay: 0.2 }}
        />
        <motion.p
          className="mt-6 text-[11px] font-medium uppercase tracking-[0.34em] text-white/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: VELORA_EASE, delay: 0.25 }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}
