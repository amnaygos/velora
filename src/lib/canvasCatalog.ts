import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type {
  CanvasConfig,
  CanvasEquipment,
  CanvasFeature,
  CanvasMaterial,
  CanvasSettings,
  CanvasSpace,
  CanvasSpaceItem,
} from "@/types/canvas";

/** Tag on the compiled catalog; every admin catalog action expires it. */
export const CANVAS_TAG = "space-canvas";

/** Images are stored as media refs; the configurator only needs the URL. */
const plain = (src: string | null) => (src ? src.split("#")[0] : null);

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  return createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Turns the catalog tables into the shape the configurator reads. Inactive rows are left out. */
export function compileCatalog(rows: {
  materials: CanvasMaterial[];
  equipment: CanvasEquipment[];
  spaces: CanvasSpace[];
  items: CanvasSpaceItem[];
  features: CanvasFeature[];
  settings: CanvasSettings & { updated_at?: string };
}): CanvasConfig {
  const equipment = rows.equipment.filter((e) => e.active);
  const equipmentKey = new Map(equipment.map((e) => [e.id, e.key]));
  const n = (v: number | string | null) => (v === null ? null : Number(v));

  return {
    version: rows.settings.updated_at ?? new Date().toISOString(),
    materials: rows.materials
      .filter((m) => m.active)
      .map((m) => ({
        key: m.key,
        label: m.label,
        image: plain(m.image),
        tile: Number(m.tile_m),
        tone: m.tone,
        effect: m.effect,
        price: { floor: n(m.price_floor), walls: n(m.price_walls), ceiling: n(m.price_ceiling) },
        floor: { dry: m.floor_dry, wet: m.floor_wet, out: m.floor_out },
      })),
    equipment: equipment.map((e) => ({
      key: e.key,
      label: e.label,
      category: e.category,
      image: plain(e.image),
      w: Number(e.width_m),
      d: Number(e.depth_m),
      h: Number(e.height_m),
      clearance: Number(e.clearance_m),
      shape: e.shape,
      price: [Number(e.price_essential), Number(e.price_premium), Number(e.price_signature)],
    })),
    spaces: rows.spaces
      .filter((s) => s.active)
      .map((s) => ({
        key: s.key,
        label: s.label,
        where: s.location,
        kind: s.kind,
        group: s.group_name,
        by: s.sizing,
        def: Number(s.default_amount),
        min: Number(s.min_amount),
        max: Number(s.max_amount),
        step: Number(s.step),
        foot: n(s.unit_footprint),
        deck: n(s.deck_factor),
        rate: [Number(s.rate_essential), Number(s.rate_premium), Number(s.rate_signature)],
        floor: s.default_floor,
        note: s.note,
        image: plain(s.image),
        heavy: s.heavy,
        heat: s.heat,
        pool: s.pool,
        forgotten: s.forgotten,
        kept: s.kept,
        named: s.named,
        light: s.light,
        entrance: s.entrance,
        pillarsOk: s.pillars_ok,
        priority: s.priority,
        render: s.render,
        cell: s.cell_style,
        items: rows.items
          .filter((i) => i.space_id === s.id && equipmentKey.has(i.equipment_id))
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((i) => ({
            equipment: equipmentKey.get(i.equipment_id)!,
            priority: i.priority,
            mode: i.qty_mode,
            qty: Number(i.qty),
            min: i.min_qty,
            max: i.max_qty,
          })),
      })),
    features: rows.features
      .filter((f) => f.active)
      .map((f) => ({
        key: f.key,
        label: f.label,
        by: f.mode,
        max: f.max_count,
        where: f.location,
        image: plain(f.image),
        price: [Number(f.price_essential), Number(f.price_premium), Number(f.price_signature)],
      })),
    settings: {
      tiers: rows.settings.tiers,
      glass: rows.settings.glass,
      lighting: rows.settings.lighting,
      fees: rows.settings.fees,
      systems: rows.settings.systems,
    },
  };
}

const readCatalog = unstable_cache(
  async (): Promise<CanvasConfig> => {
    const db = anonClient();
    const order = { ascending: true };
    const [materials, equipment, spaces, items, features, settings] = await Promise.all([
      db.from("canvas_materials").select("*").order("sort_order", order),
      db.from("canvas_equipment").select("*").order("sort_order", order),
      db.from("canvas_spaces").select("*").order("sort_order", order),
      db.from("canvas_space_items").select("*").order("sort_order", order),
      db.from("canvas_features").select("*").order("sort_order", order),
      db.from("canvas_settings").select("*").single(),
    ]);
    const failed = [materials, equipment, spaces, items, features, settings].find((r) => r.error);
    if (failed?.error || !settings.data) throw new Error(failed?.error?.message ?? "canvas_settings row missing");
    return compileCatalog({
      materials: materials.data as CanvasMaterial[],
      equipment: equipment.data as CanvasEquipment[],
      spaces: spaces.data as CanvasSpace[],
      items: items.data as CanvasSpaceItem[],
      features: features.data as CanvasFeature[],
      settings: settings.data as CanvasSettings & { updated_at: string },
    });
  },
  ["space-canvas-catalog"],
  { tags: [CANVAS_TAG], revalidate: 300 }
);

/** The compiled catalog, or null when the database can't be reached (the configurator then uses its built-in defaults). */
export async function getCanvasConfig(): Promise<CanvasConfig | null> {
  try {
    return await readCatalog();
  } catch {
    return null;
  }
}
