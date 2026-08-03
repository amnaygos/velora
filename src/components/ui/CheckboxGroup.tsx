"use client";

import { cn } from "@/lib/utils";

type CheckboxGroupProps = {
  legend: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
};

/**
 * Architectural single-choice group rendered as sharp bordered tiles.
 * Uses native radio inputs for keyboard and screen-reader support.
 */
export function CheckboxGroup({
  legend,
  options,
  value,
  onChange,
  error,
  className,
}: CheckboxGroupProps) {
  const name = `group-${legend.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <fieldset className={className}>
      <legend className="text-[10px] font-light uppercase tracking-[0.18em] text-white/45">
        {legend}
      </legend>
      <div className="mt-4 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={cn(
                "relative flex cursor-pointer items-center justify-center px-3 py-4 text-center text-[11px] font-light uppercase tracking-[0.14em] transition-colors duration-500",
                selected
                  ? "bg-shadow text-white"
                  : "bg-carbon text-white/50 hover:text-white",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {selected ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-olive"
                />
              ) : null}
              {option}
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[11px] tracking-[0.08em] text-olive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
