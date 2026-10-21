"use client";

import { PROJECT_CATEGORIES } from "@/types/project";
import { cn } from "@/lib/utils";

export type PortfolioFilter = "All" | (typeof PROJECT_CATEGORIES)[number];

export const PORTFOLIO_FILTERS: PortfolioFilter[] = [
  "All",
  ...PROJECT_CATEGORIES,
];

export function PortfolioFilters({
  value,
  onChange,
  available,
}: {
  value: PortfolioFilter;
  onChange: (filter: PortfolioFilter) => void;
  /** Categories that have published work; the others are not offered. */
  available: Set<string>;
}) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="flex flex-wrap gap-x-8 gap-y-3 border-y border-white/10 py-5"
    >
      {PORTFOLIO_FILTERS.filter((filter) => filter === "All" || available.has(filter)).map((filter) => {
        const active = value === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={active}
            className={cn(
              "relative pb-1 text-[10px] uppercase tracking-[0.24em] transition-colors duration-500",
              active ? "text-white" : "text-white/40 hover:text-white/75",
            )}
          >
            {filter}
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-0 left-0 h-px w-full origin-left bg-olive transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
