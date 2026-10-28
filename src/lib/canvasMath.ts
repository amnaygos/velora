import type { ItemPriority, QtyMode } from "@/types/canvas";

/**
 * The rules that turn a space's contents list into real items in a real room.
 * The public configurator (public/space-canvas/index.html) follows the same
 * rules — keep the two in step.
 */

export type QtyRule = { mode: QtyMode; qty: number; min: number; max: number };

/**
 * How many of an item a space gets.
 *   fixed     — exactly `qty`
 *   per_m2    — one per `qty` m² of the space
 *   per_unit  — `qty` per room, for spaces sized in rooms/units
 * Always clamped to min…max.
 */
export function quantity(rule: QtyRule, space: { area: number; units: number }): number {
  let n: number;
  if (rule.mode === "fixed") n = rule.qty;
  else if (rule.mode === "per_unit") n = rule.qty * space.units;
  else n = rule.qty > 0 ? Math.round(space.area / rule.qty) : 0;
  return Math.max(rule.min, Math.min(rule.max, Math.max(0, Math.round(n))));
}

/** A sensible room shape for a given floor area (landscape, about 1.4 : 1), snapped to 0.5 m. */
export function roomFor(area: number): { w: number; d: number } {
  const snap = (v: number) => Math.max(1, Math.round(v * 2) / 2);
  const w = snap(Math.sqrt(area * 1.4));
  return { w, d: snap(area / w) };
}

export type PackItem = { key: string; w: number; d: number; clearance: number; priority: ItemPriority };
export type Placed = PackItem & { x: number; y: number; rw: number; rd: number };

const WALL = 0.3; // gap kept from the walls

/**
 * Lays items out in rows across the room, in the order given (essential
 * first). Each item keeps its clearance free around it. Items that don't fit
 * come back in `left`, so the last-listed (recommended, then optional) are the
 * first to be left out of a small room.
 */
export function pack(room: { w: number; d: number }, items: PackItem[]): { placed: Placed[]; left: PackItem[] } {
  const placed: Placed[] = [];
  const left: PackItem[] = [];
  let x = WALL;
  let y = WALL;
  let rowD = 0;
  for (const item of items) {
    // Lay long items across the room when they're longer than the room is deep.
    let rw = item.w;
    let rd = item.d;
    if (rd > rw && rd > room.d - 2 * WALL && rw <= room.d - 2 * WALL) [rw, rd] = [rd, rw];
    if (x + rw > room.w - WALL && x > WALL) {
      x = WALL;
      y += rowD + item.clearance;
      rowD = 0;
    }
    if (x + rw > room.w - WALL + 1e-6 || y + rd > room.d - WALL + 1e-6) {
      left.push(item);
      continue;
    }
    placed.push({ ...item, x, y, rw, rd });
    x += rw + item.clearance;
    rowD = Math.max(rowD, rd);
  }
  return { placed, left };
}

/** Compact QAR, e.g. 42K, 1.25M. */
export function qar(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(Math.round(n));
}

/** A readable rule, e.g. "1 per 18 m²", "2 per room", "× 1". */
export function describeRule(rule: QtyRule, sizing: "area" | "unit"): string {
  if (rule.mode === "fixed") return `× ${rule.qty}`;
  if (rule.mode === "per_unit") return `${rule.qty} per ${sizing === "unit" ? "room" : "space"}`;
  return `1 per ${rule.qty} m²`;
}

/** A starting rule for an item dropped into a space: one per its footprint with clearance, or a single one for big pieces. */
export function defaultRule(item: { width_m: number; depth_m: number; clearance_m: number }, sizing: "area" | "unit"): QtyRule {
  if (sizing === "unit") return { mode: "per_unit", qty: 1, min: 1, max: 12 };
  const footprint = (Number(item.width_m) + Number(item.clearance_m)) * (Number(item.depth_m) + Number(item.clearance_m));
  if (footprint >= 6) return { mode: "fixed", qty: 1, min: 1, max: 1 };
  return { mode: "per_m2", qty: Math.max(1, Math.round(footprint * 2) / 2), min: 1, max: 20 };
}
