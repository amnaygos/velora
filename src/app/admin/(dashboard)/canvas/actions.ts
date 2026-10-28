"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { roleFromUser } from "@/lib/admin/rbac";
import { CANVAS_TAG } from "@/lib/canvasCatalog";
import {
  CELL_STYLES,
  EQUIPMENT_SHAPES,
  PRIORITIES,
  SPACE_RENDERS,
  TIERS,
  type CanvasEquipment,
  type CanvasFeature,
  type CanvasMaterial,
  type CanvasSettings,
  type CanvasSpace,
  type ItemPriority,
  type QtyMode,
} from "@/types/canvas";

export type CanvasResult = { ok: boolean; id?: string; key?: string; error?: string };

const TABLES = ["canvas_materials", "canvas_equipment", "canvas_spaces", "canvas_features"] as const;
type CatalogTable = (typeof TABLES)[number];

async function managerClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "Not signed in." };
  if (roleFromUser(user) !== "manager") return { supabase, error: "Managers only." };
  return { supabase, error: null };
}

/** The configurator and every admin canvas page read fresh after any change. */
function expire() {
  updateTag(CANVAS_TAG);
  revalidatePath("/admin/canvas", "layout");
}

// ---------------------------------------------------------------- validation helpers

const num = (v: unknown, min: number, max: number, fallback = min) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const optNum = (v: unknown, min: number, max: number) => (v === null || v === undefined || v === "" ? null : num(v, min, max));
const text = (v: unknown, max = 120) => String(v ?? "").trim().slice(0, max);
const optText = (v: unknown, max = 300) => text(v, max) || null;
const oneOf = <T extends string>(v: unknown, options: readonly T[], fallback: T): T => (options.includes(v as T) ? (v as T) : fallback);
const bool = (v: unknown) => v === true;
const PRICE_MAX = 100_000_000;

function slugify(label: string) {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
}

/** A key that's free in the table. Keys never change after creation, so links between rows hold. */
async function freeKey(supabase: Awaited<ReturnType<typeof createClient>>, table: CatalogTable, label: string) {
  const base = slugify(label);
  const { data } = await supabase.from(table).select("key").like("key", `${base}%`);
  const taken = new Set((data ?? []).map((r: { key: string }) => r.key));
  let key = base;
  for (let n = 2; taken.has(key); n++) key = `${base}-${n}`;
  return key;
}

async function nextOrder(supabase: Awaited<ReturnType<typeof createClient>>, table: CatalogTable) {
  const { data } = await supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  return ((data?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;
}

async function upsert(table: CatalogTable, id: string | null, row: Record<string, unknown>): Promise<CanvasResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  if (!row.label) return { ok: false, error: "Give it a name." };

  if (id) {
    const { data, error } = await supabase.from(table).update(row).eq("id", id).select("id, key").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Not found." };
    expire();
    return { ok: true, id: data.id, key: data.key };
  }
  const key = await freeKey(supabase, table, String(row.label));
  const { data, error } = await supabase
    .from(table)
    .insert({ ...row, key, sort_order: await nextOrder(supabase, table) })
    .select("id, key")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't create it." };
  expire();
  return { ok: true, id: data.id, key: data.key };
}

// ---------------------------------------------------------------- materials

export async function saveMaterial(id: string | null, input: Partial<CanvasMaterial>): Promise<CanvasResult> {
  const row = {
    label: text(input.label),
    image: optText(input.image, 1000),
    tile_m: num(input.tile_m, 0.2, 10, 2),
    tone: /^#[0-9a-f]{6}$/i.test(String(input.tone)) ? String(input.tone) : "#888888",
    effect: input.effect && ["slats", "mirror", "stretch"].includes(input.effect) ? input.effect : null,
    price_floor: optNum(input.price_floor, 0, PRICE_MAX),
    price_walls: optNum(input.price_walls, 0, PRICE_MAX),
    price_ceiling: optNum(input.price_ceiling, 0, PRICE_MAX),
    floor_dry: bool(input.floor_dry),
    floor_wet: bool(input.floor_wet),
    floor_out: bool(input.floor_out),
    active: input.active !== false,
  };
  if (row.price_floor !== null && !row.floor_dry && !row.floor_wet && !row.floor_out) {
    return { ok: false, error: "Say which floors it suits: dry rooms, wet rooms or outdoors." };
  }
  if (row.price_floor === null && row.price_walls === null && row.price_ceiling === null) {
    return { ok: false, error: "Price it for at least one surface: floor, walls or ceiling." };
  }
  return upsert("canvas_materials", id, row);
}

// ---------------------------------------------------------------- equipment

export async function saveEquipment(id: string | null, input: Partial<CanvasEquipment>): Promise<CanvasResult> {
  return upsert("canvas_equipment", id, {
    label: text(input.label),
    category: text(input.category, 40) || "Other",
    image: optText(input.image, 1000),
    width_m: num(input.width_m, 0.1, 30, 1),
    depth_m: num(input.depth_m, 0.1, 30, 1),
    height_m: num(input.height_m, 0, 6, 1),
    clearance_m: num(input.clearance_m, 0, 5, 0.6),
    shape: oneOf(input.shape, EQUIPMENT_SHAPES, "machine"),
    price_essential: num(input.price_essential, 0, PRICE_MAX, 0),
    price_premium: num(input.price_premium, 0, PRICE_MAX, 0),
    price_signature: num(input.price_signature, 0, PRICE_MAX, 0),
    note: optText(input.note),
    active: input.active !== false,
  });
}

// ---------------------------------------------------------------- spaces

export async function saveSpace(id: string | null, input: Partial<CanvasSpace>): Promise<CanvasResult> {
  const sizing = oneOf(input.sizing, ["area", "unit"] as const, "area");
  const min = num(input.min_amount, sizing === "unit" ? 1 : 1, 10000, sizing === "unit" ? 1 : 5);
  const max = num(input.max_amount, min, 10000, Math.max(min, sizing === "unit" ? 6 : 900));
  const row = {
    label: text(input.label),
    location: oneOf(input.location, ["in", "out"] as const, "in"),
    kind: oneOf(input.kind, ["dry", "wet", "out"] as const, "dry"),
    group_name: text(input.group_name, 40) || "Other rooms",
    sizing,
    min_amount: min,
    max_amount: max,
    default_amount: num(input.default_amount, min, max, min),
    step: num(input.step, sizing === "unit" ? 1 : 0.5, 100, sizing === "unit" ? 1 : 5),
    unit_footprint: sizing === "unit" ? num(input.unit_footprint, 0.5, 2000, 6) : null,
    deck_factor: input.pool ? num(input.deck_factor, 1, 5, 1.8) : null,
    rate_essential: num(input.rate_essential, 0, PRICE_MAX, 0),
    rate_premium: num(input.rate_premium, 0, PRICE_MAX, 0),
    rate_signature: num(input.rate_signature, 0, PRICE_MAX, 0),
    default_floor: optText(input.default_floor, 60),
    note: optText(input.note, 160),
    image: optText(input.image, 1000),
    heavy: bool(input.heavy),
    heat: bool(input.heat),
    pool: bool(input.pool),
    forgotten: bool(input.forgotten),
    kept: bool(input.kept),
    named: bool(input.named),
    light: oneOf(input.light, ["want", "avoid", "neutral"] as const, "neutral"),
    entrance: oneOf(input.entrance, ["near", "far", "neutral"] as const, "neutral"),
    pillars_ok: bool(input.pillars_ok),
    priority: Math.round(num(input.priority, 1, 5, 3)),
    render: oneOf(input.render, SPACE_RENDERS, "contents"),
    cell_style: input.render === "cells" ? oneOf(input.cell_style, CELL_STYLES, "room") : null,
    active: input.active !== false,
  };
  if (row.location === "out") row.kind = "out";
  if (row.location === "in" && row.kind === "out") row.kind = "dry";
  return upsert("canvas_spaces", id, row);
}

/** Drop a space card into a group: it joins that group, in the order shown. */
export async function moveSpace(id: string, group: string, orderedIds: string[]): Promise<CanvasResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  const groupName = text(group, 40);
  if (!groupName) return { ok: false, error: "Pick a group." };
  const { error } = await supabase.from("canvas_spaces").update({ group_name: groupName }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return reorderRows("canvas_spaces", orderedIds, false);
}

export type ItemInput = { equipment_id: string; priority: ItemPriority; qty_mode: QtyMode; qty: number; min_qty: number; max_qty: number };

/** Replaces a space's contents with this list, in this order. */
export async function setSpaceItems(spaceId: string, items: ItemInput[]): Promise<CanvasResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  const rows = items.slice(0, 60).map((i, index) => {
    const min = Math.round(num(i.min_qty, 0, 999, 0));
    return {
      space_id: spaceId,
      equipment_id: i.equipment_id,
      priority: oneOf(i.priority, PRIORITIES, "essential"),
      qty_mode: oneOf(i.qty_mode, ["fixed", "per_m2", "per_unit"] as const, "fixed"),
      qty: num(i.qty, i.qty_mode === "per_m2" ? 0.5 : 0, 999, 1),
      min_qty: min,
      max_qty: Math.round(num(i.max_qty, min, 999, Math.max(min, 1))),
      sort_order: index + 1,
    };
  });
  const { error: delErr } = await supabase.from("canvas_space_items").delete().eq("space_id", spaceId);
  if (delErr) return { ok: false, error: delErr.message };
  if (rows.length) {
    const { error } = await supabase.from("canvas_space_items").insert(rows);
    if (error) return { ok: false, error: error.message };
  }
  expire();
  return { ok: true };
}

// ---------------------------------------------------------------- features

export async function saveFeature(id: string | null, input: Partial<CanvasFeature>): Promise<CanvasResult> {
  const mode = oneOf(input.mode, ["toggle", "count"] as const, "toggle");
  return upsert("canvas_features", id, {
    label: text(input.label),
    mode,
    max_count: mode === "toggle" ? 1 : Math.round(num(input.max_count, 1, 99, 4)),
    location: oneOf(input.location, ["in", "out", "any"] as const, "any"),
    image: optText(input.image, 1000),
    price_essential: num(input.price_essential, 0, PRICE_MAX, 0),
    price_premium: num(input.price_premium, 0, PRICE_MAX, 0),
    price_signature: num(input.price_signature, 0, PRICE_MAX, 0),
    active: input.active !== false,
  });
}

// ---------------------------------------------------------------- shared row actions

async function reorderRows(table: CatalogTable, ids: string[], guard = true): Promise<CanvasResult> {
  const { supabase, error } = await managerClient();
  if (guard && error) return { ok: false, error };
  const results = await Promise.all(ids.map((id, index) => supabase.from(table).update({ sort_order: index + 1 }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  expire();
  return { ok: true };
}

/** The order rows appear in, everywhere: the admin and the configurator. */
export async function reorder(table: CatalogTable, ids: string[]): Promise<CanvasResult> {
  if (!TABLES.includes(table)) return { ok: false, error: "Unknown list." };
  return reorderRows(table, ids);
}

/** Hide from or show in the configurator without deleting. */
export async function setActive(table: CatalogTable, id: string, active: boolean): Promise<CanvasResult> {
  if (!TABLES.includes(table)) return { ok: false, error: "Unknown list." };
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };
  const { error } = await supabase.from(table).update({ active }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  expire();
  return { ok: true };
}

export async function deleteRow(table: CatalogTable, id: string): Promise<CanvasResult> {
  if (!TABLES.includes(table)) return { ok: false, error: "Unknown list." };
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };

  // A material that's a Feel default or a space's floor can't go: the configurator would lose a finish.
  if (table === "canvas_materials") {
    const { data: m } = await supabase.from("canvas_materials").select("key").eq("id", id).single();
    const { data: s } = await supabase.from("canvas_settings").select("tiers").single();
    const { data: floors } = await supabase.from("canvas_spaces").select("label").eq("default_floor", m?.key ?? "");
    const inTiers = m && s && JSON.stringify(s.tiers).includes(`"${m.key}"`);
    if (inTiers) return { ok: false, error: "It's a default finish in a Feel tier. Choose another finish there first." };
    if (floors?.length) return { ok: false, error: `It's the floor of ${floors.map((f) => f.label).join(", ")}. Change those first.` };
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  expire();
  return { ok: true };
}

// ---------------------------------------------------------------- pricing rules

export async function saveCanvasSettings(input: CanvasSettings): Promise<CanvasResult> {
  const { supabase, error: guard } = await managerClient();
  if (guard) return { ok: false, error: guard };

  const options = (list: CanvasSettings["glass"]) =>
    list
      .map((o) => ({ key: slugify(o.key || o.label), label: text(o.label, 40), price: num(o.price, 0, PRICE_MAX, 0) }))
      .filter((o) => o.label);
  const glass = options(input.glass);
  const lighting = options(input.lighting);
  if (!glass.length || !lighting.length) return { ok: false, error: "Keep at least one glass and one lighting option." };

  const tiers = {} as CanvasSettings["tiers"];
  for (const t of TIERS) {
    const v = input.tiers[t];
    if (!v) return { ok: false, error: "A Feel tier is missing." };
    if (!glass.some((g) => g.key === v.glass)) return { ok: false, error: `${v.label}: choose its glass.` };
    if (!lighting.some((l) => l.key === v.lighting)) return { ok: false, error: `${v.label}: choose its lighting.` };
    tiers[t] = { ...v, label: text(v.label, 30) || t, line: text(v.line, 120) };
  }

  const systems: CanvasSettings["systems"] = {};
  for (const [key, s] of Object.entries(input.systems)) {
    systems[key] = { label: text(s.label, 60) || key, base: num(s.base, 0, PRICE_MAX, 0), rate: num(s.rate, 0, PRICE_MAX, 0) };
  }

  const { error } = await supabase
    .from("canvas_settings")
    .update({
      tiers,
      glass,
      lighting,
      systems,
      fees: { design: num(input.fees.design, 0, 1, 0.12), range: num(input.fees.range, 0, 0.5, 0.1) },
    })
    .eq("id", true);
  if (error) return { ok: false, error: error.message };
  expire();
  return { ok: true };
}
