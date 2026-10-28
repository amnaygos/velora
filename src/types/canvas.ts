/**
 * The Space Canvas catalog — rows in the canvas_* tables (see
 * supabase/migrations/20261028120000_space_canvas_catalog.sql) and the
 * compiled config the public configurator reads from /api/space-canvas.
 */

export const TIERS = ["essential", "premium", "signature"] as const;
export type Tier = (typeof TIERS)[number];
export const TIER_LABEL: Record<Tier, string> = { essential: "Essential", premium: "Premium", signature: "Signature" };

export type ItemPriority = "essential" | "recommended" | "optional";
export const PRIORITIES: ItemPriority[] = ["essential", "recommended", "optional"];
export type QtyMode = "fixed" | "per_m2" | "per_unit";

export interface CanvasMaterial {
  id: string;
  key: string;
  label: string;
  image: string | null;
  tile_m: number;
  tone: string;
  effect: "slats" | "mirror" | "stretch" | null;
  price_floor: number | null;
  price_walls: number | null;
  price_ceiling: number | null;
  floor_dry: boolean;
  floor_wet: boolean;
  floor_out: boolean;
  active: boolean;
  sort_order: number;
}

export const EQUIPMENT_SHAPES = ["machine", "bike", "rig", "bench", "lounger", "locker", "counter", "table", "shelf", "tank", "washer", "bag", "mat", "kit"] as const;
export type EquipmentShape = (typeof EQUIPMENT_SHAPES)[number];

export interface CanvasEquipment {
  id: string;
  key: string;
  label: string;
  category: string;
  image: string | null;
  width_m: number;
  depth_m: number;
  height_m: number;
  clearance_m: number;
  shape: EquipmentShape;
  price_essential: number;
  price_premium: number;
  price_signature: number;
  note: string | null;
  active: boolean;
  sort_order: number;
}

export const SPACE_RENDERS = ["contents", "pool", "cells", "court", "firepit"] as const;
export type SpaceRender = (typeof SPACE_RENDERS)[number];
export const CELL_STYLES = ["wood", "infrared", "steam", "dome", "salt", "cryo", "room", "glass", "plunge", "tub"] as const;

export interface CanvasSpace {
  id: string;
  key: string;
  label: string;
  location: "in" | "out";
  kind: "dry" | "wet" | "out";
  group_name: string;
  sizing: "area" | "unit";
  default_amount: number;
  min_amount: number;
  max_amount: number;
  step: number;
  unit_footprint: number | null;
  deck_factor: number | null;
  rate_essential: number;
  rate_premium: number;
  rate_signature: number;
  default_floor: string | null;
  note: string | null;
  image: string | null;
  heavy: boolean;
  heat: boolean;
  pool: boolean;
  forgotten: boolean;
  kept: boolean;
  named: boolean;
  light: "want" | "avoid" | "neutral";
  entrance: "near" | "far" | "neutral";
  pillars_ok: boolean;
  priority: number;
  render: SpaceRender;
  cell_style: string | null;
  active: boolean;
  sort_order: number;
}

export interface CanvasSpaceItem {
  id: string;
  space_id: string;
  equipment_id: string;
  priority: ItemPriority;
  qty_mode: QtyMode;
  qty: number;
  min_qty: number;
  max_qty: number;
  sort_order: number;
}

export interface CanvasFeature {
  id: string;
  key: string;
  label: string;
  mode: "toggle" | "count";
  max_count: number;
  location: "in" | "out" | "any";
  image: string | null;
  price_essential: number;
  price_premium: number;
  price_signature: number;
  active: boolean;
  sort_order: number;
}

export interface TierFinishes {
  label: string;
  line: string;
  dry: { floor: string; walls: string; ceiling: string };
  wet: { floor: string; walls: string; ceiling: string };
  out: { floor: string };
  hall: string;
  glass: string;
  lighting: string;
}

export type PricedOption = { key: string; label: string; price: number };
export type SystemPrice = { label: string; base: number; rate: number };

export interface CanvasSettings {
  tiers: Record<Tier, TierFinishes>;
  glass: PricedOption[];
  lighting: PricedOption[];
  fees: { design: number; range: number };
  systems: Record<string, SystemPrice>;
}

/** What each system is charged on. The configurator decides when a system applies. */
export const SYSTEM_BASIS: Record<string, string> = {
  hvac: "per m² of indoor space",
  dehum: "per m² of indoor pool water",
  water: "when there's a pool, plus per cold plunge or hot tub",
  waterproof: "per m² of wet rooms",
  structure: "plus per m² of pool water above ground floor",
  acoustic: "per m² of heavy training floor above ground",
  ventilation: "per heat room (sauna, steam, hammam…)",
  irrigation: "plus per plant (planters, trees; a green wall counts as 25)",
  outlight: "per m² of outdoor space",
  drainage: "per m² of outdoor space",
  court: "per padel court",
  sound: "per m² of indoor space, when there's a training space",
  access: "plus per m² of changing rooms",
  blinds: "per metre of window",
  av: "optional, fixed",
  scent: "optional, fixed",
};

/** One space type, compiled for the configurator. */
export interface ConfigSpace {
  key: string;
  label: string;
  where: "in" | "out";
  kind: "dry" | "wet" | "out";
  group: string;
  by: "area" | "unit";
  def: number;
  min: number;
  max: number;
  step: number;
  foot: number | null;
  deck: number | null;
  rate: [number, number, number];
  floor: string | null;
  note: string | null;
  image: string | null;
  heavy: boolean;
  heat: boolean;
  pool: boolean;
  forgotten: boolean;
  kept: boolean;
  named: boolean;
  light: CanvasSpace["light"];
  entrance: CanvasSpace["entrance"];
  pillarsOk: boolean;
  priority: number;
  render: SpaceRender;
  cell: string | null;
  items: { equipment: string; priority: ItemPriority; mode: QtyMode; qty: number; min: number; max: number }[];
}

export interface CanvasConfig {
  version: string;
  materials: {
    key: string;
    label: string;
    image: string | null;
    tile: number;
    tone: string;
    effect: CanvasMaterial["effect"];
    price: { floor: number | null; walls: number | null; ceiling: number | null };
    floor: { dry: boolean; wet: boolean; out: boolean };
  }[];
  equipment: {
    key: string;
    label: string;
    category: string;
    image: string | null;
    w: number;
    d: number;
    h: number;
    clearance: number;
    shape: EquipmentShape;
    price: [number, number, number];
  }[];
  spaces: ConfigSpace[];
  features: { key: string; label: string; by: "toggle" | "count"; max: number; where: "in" | "out" | "any"; image: string | null; price: [number, number, number] }[];
  settings: CanvasSettings;
}
