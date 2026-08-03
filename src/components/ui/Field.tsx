"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CommonProps = {
  label: string;
  error?: string;
  containerClassName?: string;
};

const fieldClasses =
  "peer w-full border-0 border-b border-white/25 bg-transparent pb-3 pt-6 text-base font-light text-white outline-none transition-colors duration-500 placeholder-transparent focus:border-olive";

const labelClasses =
  "pointer-events-none absolute left-0 top-6 origin-left text-sm font-light uppercase tracking-[0.18em] text-white/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-olive peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]";

export function Field({
  label,
  error,
  containerClassName,
  id,
  className,
  ...rest
}: CommonProps & ComponentProps<"input">) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={cn("relative", containerClassName)}>
      <input
        id={fieldId}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, error && "border-white/60", className)}
        {...rest}
      />
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
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

export function TextAreaField({
  label,
  error,
  containerClassName,
  id,
  className,
  rows = 4,
  ...rest
}: CommonProps & ComponentProps<"textarea">) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={cn("relative", containerClassName)}>
      <textarea
        id={fieldId}
        rows={rows}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, "resize-none", error && "border-white/60", className)}
        {...rest}
      />
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
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
