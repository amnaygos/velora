"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { DesktopNavigation } from "@/components/layout/DesktopNavigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { VeloraWordmark } from "@/components/brand/VeloraWordmark";
import { homeNav } from "@/content/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { direction, atTop } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const hidden = direction === "down" && !atTop && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[260] flex items-center justify-between px-5 py-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-12",
          hidden && "-translate-y-full",
          atTop || menuOpen
            ? "border-b border-transparent bg-transparent"
            : "border-b border-white/10 bg-carbon/95",
        )}
      >
        <TransitionLink
          href={homeNav.href}
          transitionLabel={homeNav.transitionLabel}
          className="block text-white transition-opacity duration-500 hover:opacity-75"
          aria-label="VELORA — home"
        >
          <VeloraWordmark className="h-6 w-auto sm:h-7" />
        </TransitionLink>

        <DesktopNavigation />

        <button
          type="button"
          className="py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="velora-mobile-menu"
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
