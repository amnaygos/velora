import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  CanvasEquipment,
  CanvasFeature,
  CanvasMaterial,
  CanvasSettings,
  CanvasSpace,
  CanvasSpaceItem,
} from "@/types/canvas";

export type AdminCatalog = {
  materials: CanvasMaterial[];
  equipment: CanvasEquipment[];
  spaces: CanvasSpace[];
  items: CanvasSpaceItem[];
  features: CanvasFeature[];
  settings: CanvasSettings | null;
};

/** The whole catalog as the manager sees it, hidden rows included. Numbers arrive as numbers. */
export async function loadCatalog(): Promise<AdminCatalog> {
  const db = await createClient();
  const order = { ascending: true };
  const [materials, equipment, spaces, items, features, settings] = await Promise.all([
    db.from("canvas_materials").select("*").order("sort_order", order),
    db.from("canvas_equipment").select("*").order("sort_order", order),
    db.from("canvas_spaces").select("*").order("sort_order", order),
    db.from("canvas_space_items").select("*").order("sort_order", order),
    db.from("canvas_features").select("*").order("sort_order", order),
    db.from("canvas_settings").select("tiers, glass, lighting, fees, systems").maybeSingle(),
  ]);
  const numeric = <T,>(rows: unknown, keys: string[]): T[] =>
    ((rows as Record<string, unknown>[] | null) ?? []).map((r) => {
      const out = { ...r };
      for (const k of keys) if (out[k] !== null && out[k] !== undefined) out[k] = Number(out[k]);
      return out as T;
    });
  return {
    materials: numeric<CanvasMaterial>(materials.data, ["tile_m", "price_floor", "price_walls", "price_ceiling"]),
    equipment: numeric<CanvasEquipment>(equipment.data, ["width_m", "depth_m", "height_m", "clearance_m", "price_essential", "price_premium", "price_signature"]),
    spaces: numeric<CanvasSpace>(spaces.data, ["default_amount", "min_amount", "max_amount", "step", "unit_footprint", "deck_factor", "rate_essential", "rate_premium", "rate_signature"]),
    items: numeric<CanvasSpaceItem>(items.data, ["qty"]),
    features: numeric<CanvasFeature>(features.data, ["price_essential", "price_premium", "price_signature"]),
    settings: (settings.data as CanvasSettings | null) ?? null,
  };
}
