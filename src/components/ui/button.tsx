"use client";

import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/RouteTransitionProvider";
import { cn } from "@/lib/utils";

const baseClasses =
  "group relative inline-flex items-center gap-3 overflow-hidden border border-white/30 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:border-white focus-visible:border-white";

function ButtonInner({
  children,
  withArrow,
}: {
  children: ReactNode;
  withArrow?: boolean;
}) {
  return (
    <>
      {/* White fill sweeps in from the left on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-[101%] bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
      />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-carbon">
        {children}
      </span>
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          size={14}
          strokeWidth={1.5}
          className="relative z-10 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-carbon"
        />
      ) : null}
    </>
  );
}

type ButtonLinkProps = {
  href: string;
  transitionLabel: string;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  transitionLabel,
  withArrow = true,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <TransitionLink
      href={href}
      transitionLabel={transitionLabel}
      className={cn(baseClasses, className)}
    >
      <ButtonInner withArrow={withArrow}>{children}</ButtonInner>
    </TransitionLink>
  );
}

type ButtonProps = ComponentProps<"button"> & { withArrow?: boolean };

export function Button({
  children,
  withArrow = true,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn(baseClasses, className)} {...rest}>
      <ButtonInner withArrow={withArrow}>{children}</ButtonInner>
    </button>
  );
}
