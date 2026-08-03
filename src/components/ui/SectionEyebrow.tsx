import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[10px] font-normal uppercase tracking-[0.28em] sm:text-xs",
        accent ? "text-olive" : "text-white/50",
        className,
      )}
    >
      {children}
    </p>
  );
}
