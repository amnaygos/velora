import type { SVGProps } from "react";

/**
 * The VELORA mark: a V beneath its horizontal bar. Source: brand file
 * "logo.svg", cropped to its visible content and recolored to
 * currentColor. `outline` renders the thin architectural stroke version
 * used by the preloader.
 */
export function VeloraMark({
  outline = false,
  ...props
}: SVGProps<SVGSVGElement> & { outline?: boolean }) {
  const paint = outline
    ? { fill: "none", stroke: "currentColor", strokeWidth: 2 }
    : { fill: "currentColor" };
  return (
    <svg
      viewBox="47 49 96 131"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <polygon
        {...paint}
        points="122.18 89.08 139.07 89.2 103.2 177.66 86.88 177.53 50.91 89.09 68.06 89.02 95.12 154.54 122.18 89.08"
      />
      <rect {...paint} x="49.04" y="51.28" width="91.9" height="12.51" />
    </svg>
  );
}
