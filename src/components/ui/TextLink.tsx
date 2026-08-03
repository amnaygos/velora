"use client";

import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { cn } from "@/lib/utils";

const baseClasses =
  "group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 transition-colors duration-500 hover:text-white";

function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-olive transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </span>
  );
}

export function TextLink({
  href,
  transitionLabel,
  children,
  className,
  withArrow = true,
}: {
  href: string;
  transitionLabel: string;
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <TransitionLink
      href={href}
      transitionLabel={transitionLabel}
      className={cn(baseClasses, className)}
    >
      <Underlined>{children}</Underlined>
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          size={13}
          strokeWidth={1.5}
          className="transition-transform duration-500 group-hover:translate-x-1"
        />
      ) : null}
    </TransitionLink>
  );
}

export function ExternalTextLink({
  href,
  children,
  className,
  withArrow = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseClasses, className)}
    >
      <Underlined>{children}</Underlined>
      {withArrow ? (
        <ArrowUpRight
          aria-hidden="true"
          size={13}
          strokeWidth={1.5}
          className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : null}
    </a>
  );
}
