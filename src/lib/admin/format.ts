import { format, isPast, isToday, isValid, parseISO } from "date-fns";

export function formatCompactQAR(value: number | null): string {
  if (!value) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

/*
 * These only accept real ISO dates/timestamps (created_at, event_date).
 * Free-text columns like projects.target_completion ("Q3 2027", "TBD") must
 * be rendered as-is — never passed through here. The isValid guards keep an
 * unparseable value from throwing and taking down the whole page.
 */
function parseValid(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = parseISO(dateStr);
  return isValid(d) ? d : null;
}

export function formatDateLabel(dateStr: string | null): string {
  const d = parseValid(dateStr);
  return d ? format(d, "MMM d").toUpperCase() : "—";
}

export function formatDateLong(dateStr: string | null): string {
  const d = parseValid(dateStr);
  return d ? format(d, "d MMM yyyy").toUpperCase() : "—";
}

export function isOverdue(dateStr: string | null): boolean {
  const d = parseValid(dateStr);
  if (!d) return false;
  return isPast(d) && !isToday(d);
}

export function relativeDay(dateStr: string): string {
  const d = parseValid(dateStr);
  if (!d) return "—";
  if (isToday(d)) return "TODAY";
  return format(d, "EEE d MMM").toUpperCase();
}

export const STAGE_LABEL: Record<string, string> = {
  consultation: "CONSULT",
  design: "DESIGN",
  build: "BUILD",
  operations: "OPERATE",
};

export const CATEGORY_LABEL: Record<string, string> = {
  gyms_fitness: "GYMS & FITNESS",
  spa_wellness: "SPA & WELLNESS",
  hospitality: "HOSPITALITY",
};
