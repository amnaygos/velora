"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { MagneticTextLink } from "@/components/motion/MagneticTextLink";
import { enquireNav, mainNav } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center lg:flex">
      <ul className="flex items-center gap-5 xl:gap-8">
        {mainNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <MagneticTextLink>
                <TransitionLink
                  href={item.href}
                  transitionLabel={item.transitionLabel}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative block py-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500",
                    active ? "text-white" : "text-white/55 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-olive transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </TransitionLink>
              </MagneticTextLink>
            </li>
          );
        })}
        <li className="border-l border-white/15 pl-5 xl:pl-8">
          <MagneticTextLink>
            <TransitionLink
              href={enquireNav.href}
              transitionLabel={enquireNav.transitionLabel}
              className="group inline-flex items-center gap-2 py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition-colors duration-500 hover:text-white"
            >
              {enquireNav.label}
              <ArrowRight
                aria-hidden="true"
                size={12}
                strokeWidth={1.5}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </TransitionLink>
          </MagneticTextLink>
        </li>
      </ul>
    </nav>
  );
}
