"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { mobileNav } from "@/content/navigation";
import { site, socials } from "@/content/site";
import { VELORA_EASE } from "@/lib/gsap";

const overlayVariants = {
  closed: { clipPath: "inset(0% 0% 100% 0%)" },
  open: { clipPath: "inset(0% 0% 0% 0%)" },
};

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="velora-mobile-menu"
          className="fixed inset-0 z-[250] flex flex-col justify-between bg-carbon px-5 pb-10 pt-28 sm:px-8"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.7, ease: VELORA_EASE }}
        >
          <nav aria-label="Mobile">
            <ul className="space-y-2">
              {mobileNav.map((item, index) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%", transition: { duration: 0.25 } }}
                    transition={{
                      duration: 0.8,
                      ease: VELORA_EASE,
                      delay: 0.15 + index * 0.07,
                    }}
                  >
                    <TransitionLink
                      href={item.href}
                      transitionLabel={item.transitionLabel}
                      onNavigateStart={onClose}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="text-[10px] font-normal tracking-[0.2em] text-olive">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg font-extralight uppercase tracking-[0.07em] text-white/85 transition-colors duration-500 group-hover:text-white sm:text-xl">
                        {item.label}
                      </span>
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: VELORA_EASE, delay: 0.5 }}
            className="space-y-6 border-t border-white/10 pt-8"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
              {site.cities}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="block text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
            >
              {site.email.toUpperCase()}
            </a>
            <ul className="flex gap-6">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
