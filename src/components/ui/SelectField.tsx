"use client";

import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectFieldProps = {
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  containerClassName?: string;
} & ComponentProps<"select">;

export function SelectField({
  label,
  options,
  placeholder = "Select",
  error,
  containerClassName,
  id,
  className,
  ...rest
}: SelectFieldProps) {
  const fieldId = id ?? `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={cn("relative", containerClassName)}>
      <label
        htmlFor={fieldId}
        className="pointer-events-none absolute left-0 top-0 text-[10px] font-light uppercase tracking-[0.18em] text-white/45"
      >
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        defaultValue=""
        className={cn(
          "w-full appearance-none border-0 border-b border-white/25 bg-transparent pb-3 pt-6 text-base font-light text-white outline-none transition-colors duration-500 focus:border-olive",
          error && "border-white/60",
          className,
        )}
        {...rest}
      >
        <option value="" disabled className="bg-shadow text-white/50">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-shadow text-white">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-0 top-7 text-white/40"
      />
      {error ? (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="mt-2 text-[11px] font-normal tracking-[0.08em] text-olive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
