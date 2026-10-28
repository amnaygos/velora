"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Search, Trash2, X } from "lucide-react";
import {
  CELL_STYLES,
  PRIORITIES,
  TIERS,
  TIER_LABEL,
  type CanvasEquipment,
  type CanvasMaterial,
  type CanvasSpace,
  type CanvasSpaceItem,
  type ItemPriority,
  type QtyMode,
  type Tier,
} from "@/types/canvas";
import { defaultRule, pack, qar, quantity, roomFor, type PackItem } from "@/lib/canvasMath";
import { deleteRow, saveSpace, setSpaceItems, type ItemInput } from "../actions";
import { ImageDrop, PriceTriple, Seg, Toggle } from "../ui";

type Row = ItemInput & { uid: string };

const LANES: { key: ItemPriority; title: string; hint: string }[] = [
  { key: "essential", title: "Essential", hint: "Always in the space." },
  { key: "recommended", title: "Recommended", hint: "In by default. First to go when the room is too small; the client can remove it." },
  { key: "optional", title: "Optional", hint: "Off by default. The client can add it." },
];

const RENDER_LABEL: Record<string, string> = {
  contents: "A room with its contents",
  pool: "A pool with its deck",
  cells: "A row of rooms (cabins)",
  court: "A sports court",
  firepit: "A fire pit with seating",
};
const CELL_LABEL: Record<string, string> = {
  wood: "Timber cabin", infrared: "Infrared cabin", steam: "Steam (glass)", dome: "Domed stone", salt: "Salt (pink)",
  cryo: "Cryo (white)", room: "Plain room", glass: "Glass enclosure", plunge: "Plunge tub", tub: "Hot tub",
};

const blankSpace = (location: "in" | "out", group: string): CanvasSpace => ({
  id: "", key: "", label: "", location, kind: location === "out" ? "out" : "dry", group_name: group || "Other rooms", sizing: "area",
  default_amount: 20, min_amount: 5, max_amount: 900, step: 5, unit_footprint: null, deck_factor: null, rate_essential: 0,
  rate_premium: 0, rate_signature: 0, default_floor: null, note: null, image: null, heavy: false, heat: false, pool: false,
  forgotten: false, kept: false, named: false, light: "neutral", entrance: "neutral", pillars_ok: false, priority: 3,
  render: "contents", cell_style: null, active: true, sort_order: 0,
});

let uidSeq = 0;
const uid = () => `r${++uidSeq}`;
const toRows = (items: CanvasSpaceItem[]): Row[] =>
  items.map((i) => ({ uid: uid(), equipment_id: i.equipment_id, priority: i.priority, qty_mode: i.qty_mode, qty: i.qty, min_qty: i.min_qty, max_qty: i.max_qty }));
const strip = (rows: Row[]): ItemInput[] =>
  rows.map((r) => ({ equipment_id: r.equipment_id, priority: r.priority, qty_mode: r.qty_mode, qty: r.qty, min_qty: r.min_qty, max_qty: r.max_qty }));

export default function SpaceEditor({
  space,
  items,
  equipment,
  materials,
  groups,
  defaults,
}: {
  space: CanvasSpace | null;
  items: CanvasSpaceItem[];
  equipment: CanvasEquipment[];
  materials: CanvasMaterial[];
  groups: string[];
  defaults: { location: "in" | "out"; group: string };
}) {
  const router = useRouter();
  const initialForm = useMemo(() => space ?? blankSpace(defaults.location, defaults.group), [space, defaults.location, defaults.group]);
  const [form, setForm] = useState<CanvasSpace>(initialForm);
  const [rows, setRows] = useState<Row[]>(() => toRows(items));
  const [saved, setSaved] = useState(() => JSON.stringify([initialForm, strip(toRows(items))]));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const eqById = useMemo(() => new Map(equipment.map((e) => [e.id, e])), [equipment]);
  const dirty = JSON.stringify([form, strip(rows)]) !== saved;
  const set = (patch: Partial<CanvasSpace>) => {
    setForm((f) => ({ ...f, ...patch }));
    setNotice(null);
  };
  const unit = form.sizing === "unit";

  // ---------------------------------------------------------- save / delete
  const save = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const r = await saveSpace(space?.id ?? null, form);
      if (!r.ok || !r.id) return setError(r.error ?? "Couldn't save.");
      const ri = await setSpaceItems(r.id, strip(rows));
      if (!ri.ok) return setError(ri.error ?? "Saved the space, but not its contents.");
      setSaved(JSON.stringify([form, strip(rows)]));
      setNotice("Saved — live in the configurator.");
      if (!space) router.replace(`/admin/canvas/spaces/${r.id}`);
      else router.refresh();
    });
  }, [form, rows, space, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !pending) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, pending, save]);

  function remove() {
    if (!space) return;
    startTransition(async () => {
      const r = await deleteRow("canvas_spaces", space.id);
      if (!r.ok) return setError(r.error ?? "Couldn't delete.");
      setSaved(JSON.stringify([form, strip(rows)]));
      router.push("/admin/canvas/spaces");
    });
  }

  // ---------------------------------------------------------- contents drag & drop
  const drag = useRef<{ kind: "equipment" | "row"; id: string } | null>(null);
  const [drop, setDrop] = useState<{ lane: ItemPriority; index: number } | null>(null);

  function addEquipment(equipmentId: string, lane: ItemPriority, index?: number) {
    setRows((current) => {
      const existing = current.find((r) => r.equipment_id === equipmentId);
      if (existing) return moveRow(current, existing.uid, lane, index);
      const e = eqById.get(equipmentId);
      if (!e) return current;
      const rule = defaultRule(e, form.sizing);
      const row: Row = { uid: uid(), equipment_id: equipmentId, priority: lane, qty_mode: rule.mode, qty: rule.qty, min_qty: lane === "essential" ? Math.max(1, rule.min) : 0, max_qty: rule.max };
      return insertAt(current, row, lane, index);
    });
    setNotice(null);
  }

  function moveRow(current: Row[], rowUid: string, lane: ItemPriority, index?: number): Row[] {
    const row = current.find((r) => r.uid === rowUid);
    if (!row) return current;
    return insertAt(current.filter((r) => r.uid !== rowUid), { ...row, priority: lane }, lane, index);
  }

  /** Insert into a lane at a lane-relative index (end when undefined); rows stay grouped by lane. */
  function insertAt(current: Row[], row: Row, lane: ItemPriority, index?: number): Row[] {
    const byLane = PRIORITIES.map((p) => current.filter((r) => r.priority === p));
    const target = byLane[PRIORITIES.indexOf(lane)];
    target.splice(index === undefined ? target.length : Math.min(index, target.length), 0, row);
    return byLane.flat();
  }

  const laneProps = (lane: ItemPriority, index: number) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!drag.current) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = drag.current.kind === "equipment" ? "copy" : "move";
      if (drop?.lane !== lane || drop.index !== index) setDrop({ lane, index });
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const d = drag.current;
      drag.current = null;
      setDrop(null);
      if (!d) return;
      if (d.kind === "equipment") addEquipment(d.id, lane, index);
      else setRows((current) => moveRow(current, d.id, lane, index));
      setNotice(null);
    },
  });

  const patchRow = (rowUid: string, patch: Partial<Row>) => {
    setRows((current) => current.map((r) => (r.uid === rowUid ? { ...r, ...patch } : r)));
    setNotice(null);
  };

  // ---------------------------------------------------------- preview
  const [previewAmount, setPreviewAmount] = useState<number>(Number(initialForm.default_amount));
  const [tier, setTier] = useState<Tier>("premium");
  const [withOptional, setWithOptional] = useState(false);
  const amount = Math.min(Math.max(previewAmount, form.min_amount), form.max_amount);
  const area = unit ? amount * (form.unit_footprint ?? 0) : amount;
  const ti = TIERS.indexOf(tier);
  const price = (e: CanvasEquipment) => [e.price_essential, e.price_premium, e.price_signature][ti];

  const computed = rows.map((r) => {
    const e = eqById.get(r.equipment_id);
    const qty = e ? quantity({ mode: r.qty_mode, qty: r.qty, min: r.min_qty, max: r.max_qty }, { area, units: unit ? amount : 1 }) : 0;
    return { row: r, e, qty };
  });
  const included = computed.filter((c) => c.e && c.qty > 0 && (c.row.priority !== "optional" || withOptional));
  const room = roomFor(Math.max(1, area));
  const packed =
    form.render === "contents" && !unit
      ? pack(
          room,
          included.flatMap((c) =>
            Array.from({ length: c.qty }, (): PackItem => ({ key: c.e!.id, w: c.e!.width_m, d: c.e!.depth_m, clearance: c.e!.clearance_m, priority: c.row.priority }))
          )
        )
      : null;
  const leftOut = new Map<string, number>();
  for (const l of packed?.left ?? []) leftOut.set(l.key, (leftOut.get(l.key) ?? 0) + 1);
  const fitout = (unit ? amount : area) * [form.rate_essential, form.rate_premium, form.rate_signature][ti];
  // Priced by the quantity rules, as in the configurator; what doesn't fit is a layout warning, not a discount.
  const equipmentCost = included.reduce((sum, c) => sum + c.qty * price(c.e!), 0);

  // ---------------------------------------------------------- tray
  const [trayQuery, setTrayQuery] = useState("");
  const [trayCat, setTrayCat] = useState("All");
  const trayCats = Array.from(new Set(equipment.map((e) => e.category)));
  const inSpace = new Set(rows.map((r) => r.equipment_id));
  const tray = equipment.filter(
    (e) => e.active && (trayCat === "All" || e.category === trayCat) && e.label.toLowerCase().includes(trayQuery.trim().toLowerCase())
  );

  const floorOptions = materials.filter(
    (m) => m.active && m.price_floor !== null && (form.kind === "out" ? m.floor_out : form.kind === "wet" ? m.floor_wet : m.floor_dry)
  );

  return (
    <>
      <div className="editor-bar">
        <Link href="/admin/canvas/spaces" className="btn btn-ghost btn-sm">← ALL SPACES</Link>
        <h2 className="editor-title">{form.label.trim() || "New space"}</h2>
        <span className="editor-state tt-none" aria-live="polite">{pending ? "Saving…" : error ? "" : dirty ? "Unsaved changes" : notice ?? ""}</span>
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={pending || (!dirty && Boolean(space))}>
          {space ? "SAVE" : "CREATE SPACE"}
        </button>
      </div>
      {error && <div className="login-error mb-24">{error}</div>}

      <div className="grid cols-main gap-24 editor">
        {/* ============================== contents & preview */}
        <div className="stack gap-24">
          <div className="panel">
            <div className="panel-head">
              <h3>WHAT IT CONTAINS</h3>
              <span className="dim tt-none" style={{ fontSize: 11 }}>
                {form.render === "contents" ? "Drag equipment from the tray into a lane, or between lanes." : "Priced with the space; drawn as " + RENDER_LABEL[form.render].toLowerCase() + "."}
              </span>
            </div>
            <div className="lanes">
              {LANES.map((lane) => {
                const laneRows = rows.filter((r) => r.priority === lane.key);
                return (
                  <section key={lane.key} className={`lane lane-${lane.key}${drop?.lane === lane.key ? " over" : ""}`} {...laneProps(lane.key, laneRows.length)} aria-label={lane.title}>
                    <header>
                      <b>{lane.title}</b>
                      <span className="tnum">{laneRows.length}</span>
                    </header>
                    <p className="lane-hint tt-none">{lane.hint}</p>
                    {laneRows.map((r, index) => {
                      const c = computed.find((x) => x.row.uid === r.uid)!;
                      const e = c.e;
                      if (!e) return null;
                      const didntFit = leftOut.get(r.equipment_id) ?? 0;
                      return (
                        <div key={r.uid} className={`item-card${drop?.lane === lane.key && drop.index === index ? " insert" : ""}`} draggable
                          onDragStart={(ev) => {
                            ev.dataTransfer.effectAllowed = "move";
                            ev.dataTransfer.setData("text/x-item", r.uid);
                            drag.current = { kind: "row", id: r.uid };
                          }}
                          onDragEnd={() => {
                            drag.current = null;
                            setDrop(null);
                          }}
                          {...laneProps(lane.key, index)}
                        >
                          <div className="item-head">
                            <GripVertical size={12} strokeWidth={1.4} className="pf-grip" aria-hidden="true" />
                            {e.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={e.image.split("#")[0]} alt="" draggable={false} />
                            ) : (
                              <span className="item-mono">{e.label.slice(0, 1)}</span>
                            )}
                            <span className="item-name">
                              <b className="tt-none">{e.label}</b>
                              <small className="tnum">
                                {c.qty} × {qar(price(e))} = {qar(c.qty * price(e))}
                                {didntFit ? ` · ${didntFit} won't fit` : ""}
                              </small>
                            </span>
                            <button type="button" className="icon-btn" aria-label={`Remove ${e.label}`} title="Remove" onClick={() => setRows((cur) => cur.filter((x) => x.uid !== r.uid))}>
                              <X size={12} strokeWidth={1.4} />
                            </button>
                          </div>
                          <div className="item-rule">
                            <select value={r.qty_mode} aria-label="How many" onChange={(ev) => patchRow(r.uid, { qty_mode: ev.target.value as QtyMode })}>
                              <option value="fixed">Exactly</option>
                              <option value="per_m2">One per … m²</option>
                              <option value="per_unit">{unit ? "Per room" : "Per space"}</option>
                            </select>
                            <input type="number" min={r.qty_mode === "per_m2" ? 0.5 : 0} step={r.qty_mode === "per_m2" ? 0.5 : 1} value={r.qty} aria-label="Quantity" onChange={(ev) => patchRow(r.uid, { qty: Number(ev.target.value) })} />
                          </div>
                          <div className="item-range">
                            <span className="dim">min</span>
                            <input type="number" min={0} value={r.min_qty} aria-label="At least" onChange={(ev) => patchRow(r.uid, { min_qty: Number(ev.target.value) })} />
                            <span className="dim">max</span>
                            <input type="number" min={0} value={r.max_qty} aria-label="At most" onChange={(ev) => patchRow(r.uid, { max_qty: Number(ev.target.value) })} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="lane-drop" {...laneProps(lane.key, laneRows.length)}>
                      {laneRows.length ? "Drop here" : "Drop equipment here"}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="tray">
              <div className="tray-head">
                <b>EQUIPMENT</b>
                <div className="filters">
                  {["All", ...trayCats].map((c) => (
                    <button key={c} type="button" className={`chip${trayCat === c ? " on" : ""}`} onClick={() => setTrayCat(c)}>{c}</button>
                  ))}
                </div>
                <label className="search-box">
                  <Search size={13} strokeWidth={1.4} />
                  <input type="search" placeholder="Find" value={trayQuery} onChange={(e) => setTrayQuery(e.target.value)} aria-label="Find equipment" />
                </label>
                <Link href="/admin/canvas/equipment" className="btn btn-ghost btn-sm">MANAGE</Link>
              </div>
              <div className="tray-row">
                {tray.map((e) => (
                  <div
                    key={e.id}
                    className={`tray-card${inSpace.has(e.id) ? " added" : ""}`}
                    draggable
                    title={`${e.label} · ${e.width_m} × ${e.depth_m} m`}
                    onDragStart={(ev) => {
                      ev.dataTransfer.effectAllowed = "copyMove";
                      ev.dataTransfer.setData("text/x-equipment", e.id);
                      drag.current = { kind: "equipment", id: e.id };
                    }}
                    onDragEnd={() => {
                      drag.current = null;
                      setDrop(null);
                    }}
                  >
                    {e.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.image.split("#")[0]} alt="" draggable={false} />
                    ) : (
                      <span className="item-mono">{e.label.slice(0, 1)}</span>
                    )}
                    <b className="tt-none">{e.label}</b>
                    <small className="tnum">{qar(e.price_premium)} · {e.width_m}×{e.depth_m} m</small>
                    <button type="button" className="tray-add" aria-label={`Add ${e.label} as essential`} title={inSpace.has(e.id) ? "Already in this space" : "Add as essential"} onClick={() => addEquipment(e.id, inSpace.has(e.id) ? rows.find((r) => r.equipment_id === e.id)!.priority : "essential")}>
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>PREVIEW</h3>
              <div style={{ width: 300 }}>
                <Seg label="Feel" value={tier} onChange={setTier} options={TIERS.map((t) => ({ value: t, label: TIER_LABEL[t].toUpperCase() }))} />
              </div>
            </div>
            <div className="panel-pad">
              <div className="preview-controls">
                <label className="field" style={{ marginBottom: 0, flex: 1 }}>
                  <span className="label">{unit ? `${amount} room${amount === 1 ? "" : "s"}` : `${amount} m² · ${room.w} × ${room.d} m`}</span>
                  <input type="range" min={form.min_amount} max={Math.min(form.max_amount, unit ? form.max_amount : 400)} step={form.step || 1} value={amount} onChange={(e) => setPreviewAmount(Number(e.target.value))} aria-label="Preview size" />
                </label>
                <Toggle on={withOptional} onChange={setWithOptional} title="Include optional" />
              </div>

              {packed ? <RoomPlan room={room} placed={packed.placed} eqById={eqById} /> : <p className="dim tt-none preview-note">{unit ? `Drawn as ${amount} ${form.render === "cells" ? "cabins" : "units"} of ${form.unit_footprint ?? "?"} m² each.` : `Drawn as ${RENDER_LABEL[form.render].toLowerCase()}.`} The contents are priced, not laid out.</p>}

              <dl className="preview-costs tnum">
                <div><dt>Fit-out</dt><dd>QAR {qar(fitout)}</dd></div>
                <div><dt>Equipment</dt><dd>QAR {qar(equipmentCost)}</dd></div>
                <div className="total"><dt>{TIER_LABEL[tier]} total</dt><dd>QAR {qar(fitout + equipmentCost)}</dd></div>
                <div><dt>Per m²</dt><dd>QAR {area ? qar((fitout + equipmentCost) / area) : "—"}</dd></div>
              </dl>
              {packed && packed.left.length > 0 && (
                <p className="field-hint warn mt-16">
                  Doesn&apos;t fit at this size: {Array.from(leftOut.entries()).map(([id, n]) => `${n} × ${eqById.get(id)?.label}`).join(", ")}. Recommended and optional items are left out first.
                </p>
              )}
              <p className="field-hint mt-16">Finishes, glass and light are added in the configurator from the Feel and the client&apos;s choices.</p>
            </div>
          </div>
        </div>

        {/* ============================== details */}
        <div className="stack gap-24">
          <div className="panel panel-pad">
            <div className="label mb-16">PHOTO · LIBRARY TILE</div>
            <ImageDrop value={form.image} onChange={(image) => set({ image })} ratio="16 / 9" label="Drop a photo of this space" />
            <div className="field mt-24">
              <label>Name <span className="req">*</span></label>
              <input type="text" className="tt-none" value={form.label} placeholder="Recovery suite" onChange={(e) => set({ label: e.target.value })} />
            </div>
            <div className="field">
              <label>Group</label>
              <input type="text" className="tt-none" list="space-groups" value={form.group_name} onChange={(e) => set({ group_name: e.target.value })} />
              <datalist id="space-groups">{groups.map((g) => <option key={g} value={g} />)}</datalist>
            </div>
            <div className="field">
              <label>Note in the library</label>
              <input type="text" className="tt-none" value={form.note ?? ""} placeholder="Cardio & strength floor" onChange={(e) => set({ note: e.target.value })} />
            </div>
            <div className="mb-16">
              <Seg label="Indoor or outdoor" value={form.location} onChange={(location) => set({ location, kind: location === "out" ? "out" : form.kind === "out" ? "dry" : form.kind })} options={[{ value: "in", label: "INDOOR" }, { value: "out", label: "OUTDOOR" }]} />
            </div>
            {form.location === "in" && (
              <Seg label="Dry or wet" value={form.kind === "wet" ? "wet" : "dry"} onChange={(kind) => set({ kind })} options={[{ value: "dry", label: "DRY ROOM" }, { value: "wet", label: "WET ROOM", title: "Tanked floor, wet-room finishes" }]} />
            )}
          </div>

          <div className="panel panel-pad">
            <div className="label mb-16">SIZE</div>
            <div className="mb-16">
              <Seg label="Sized by" value={form.sizing} onChange={(sizing) => set(sizing === "unit" ? { sizing, min_amount: 1, max_amount: 6, step: 1, default_amount: 1, unit_footprint: form.unit_footprint ?? 6 } : { sizing, min_amount: 5, max_amount: 900, step: 5, default_amount: 20, unit_footprint: null })} options={[{ value: "area", label: "AREA (M²)" }, { value: "unit", label: "ROOMS / UNITS" }]} />
            </div>
            <div className="dims-row four">
              {(
                [
                  ["default_amount", "Starts at"],
                  ["min_amount", "Min"],
                  ["max_amount", "Max"],
                  ["step", "Step"],
                ] as const
              ).map(([k, l]) => (
                <label key={k}>
                  <span>{l}</span>
                  <input type="number" min={0} value={form[k]} onChange={(e) => set({ [k]: Number(e.target.value) } as Partial<CanvasSpace>)} />
                </label>
              ))}
            </div>
            {unit && (
              <div className="field mt-16">
                <label>Each room or unit takes (m²)</label>
                <input type="number" min={0.5} step={0.5} value={form.unit_footprint ?? 6} onChange={(e) => set({ unit_footprint: Number(e.target.value) })} />
              </div>
            )}
            <div className="mt-16">
              <Toggle on={form.pool} onChange={(pool) => set({ pool, deck_factor: pool ? form.deck_factor ?? 1.8 : null, render: pool ? "pool" : form.render === "pool" ? "contents" : form.render })} title="It's a pool" hint="Size is the water; the deck around it is added." />
            </div>
            {form.pool && (
              <div className="field mt-16">
                <label>Footprint = water × {form.deck_factor ?? 1.8}</label>
                <input type="range" min={1.2} max={3} step={0.1} value={form.deck_factor ?? 1.8} onChange={(e) => set({ deck_factor: Number(e.target.value) })} />
              </div>
            )}
          </div>

          <div className="panel panel-pad">
            <div className="label mb-16">FIT-OUT PRICE · QAR {unit ? "PER ROOM" : "PER M²"}</div>
            <PriceTriple values={[form.rate_essential, form.rate_premium, form.rate_signature]} onChange={([a, b, c]) => set({ rate_essential: a, rate_premium: b, rate_signature: c })} />
            <p className="field-hint mt-16">Building and fitting the space out. Its equipment is priced from the catalog; finishes, glass and light come from the client&apos;s choices.</p>
            <div className="field mt-24" style={{ marginBottom: 0 }}>
              <label>Floor finish</label>
              <select value={form.default_floor ?? ""} onChange={(e) => set({ default_floor: e.target.value || null })}>
                <option value="">The Feel&apos;s default</option>
                {floorOptions.map((m) => <option key={m.key} value={m.key}>{m.label} · {m.price_floor}/m²</option>)}
              </select>
            </div>
          </div>

          <div className="panel panel-pad">
            <div className="label mb-16">PLACEMENT ON THE PLAN</div>
            <div className="field">
              <label>Priority · {form.priority} of 5</label>
              <Seg label="Placement priority" value={String(form.priority) as "1"} onChange={(v) => set({ priority: Number(v) })} options={["1", "2", "3", "4", "5"].map((v) => ({ value: v as "1", label: v }))} />
              <p className="field-hint">Higher goes first: it gets the best spot, and is the last left out when the plan is too small.</p>
            </div>
            <div className="field">
              <label>Daylight</label>
              <Seg label="Daylight" value={form.light} onChange={(light) => set({ light })} options={[{ value: "want", label: "NEAR WINDOWS" }, { value: "neutral", label: "EITHER" }, { value: "avoid", label: "AWAY" }]} />
            </div>
            <div className="field">
              <label>From the entrance</label>
              <Seg label="Entrance" value={form.entrance} onChange={(entrance) => set({ entrance })} options={[{ value: "near", label: "NEAR" }, { value: "neutral", label: "EITHER" }, { value: "far", label: "FAR" }]} />
            </div>
            <Toggle on={form.pillars_ok} onChange={(pillars_ok) => set({ pillars_ok })} title="Can have columns in it" hint="Open areas work around pillars; pools and cabins can't." />
          </div>

          <div className="panel panel-pad">
            <div className="label mb-16">IN THE 3D MODEL</div>
            <div className="field">
              <label>Drawn as</label>
              <select value={form.render} onChange={(e) => set({ render: e.target.value as CanvasSpace["render"], cell_style: e.target.value === "cells" ? form.cell_style ?? "room" : null })}>
                {Object.entries(RENDER_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            {form.render === "cells" && (
              <div className="field">
                <label>Cabin style</label>
                <select value={form.cell_style ?? "room"} onChange={(e) => set({ cell_style: e.target.value })}>
                  {CELL_STYLES.map((c) => <option key={c} value={c}>{CELL_LABEL[c]}</option>)}
                </select>
              </div>
            )}
            <div className="label mb-16 mt-16">WHAT IT TRIGGERS</div>
            <Toggle on={form.heavy} onChange={(heavy) => set({ heavy })} title="Heavy training" hint="Load and acoustic checks above ground floor." />
            <Toggle on={form.heat} onChange={(heat) => set({ heat })} title="Heat room" hint="Adds heat & steam extraction." />
            <Toggle on={form.forgotten} onChange={(forgotten) => set({ forgotten })} title="Often forgotten" hint="Flagged in the library so clients remember it." />
            <Toggle on={form.named} onChange={(named) => set({ named })} title="The client names it" />
            <Toggle on={form.kept} onChange={(kept) => set({ kept })} title="Existing room, kept" hint="Takes floor area; no works, no cost." />
          </div>

          <div className="panel panel-pad">
            <Toggle on={form.active} onChange={(active) => set({ active })} title="In the configurator" hint="Hidden spaces aren't offered to clients." />
            {space && (
              <div className="mt-24">
                {confirmDelete ? (
                  <div className="flex gap-8">
                    <button type="button" className="btn btn-primary btn-sm" onClick={remove} disabled={pending}>CONFIRM DELETE</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(false)}>KEEP IT</button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={12} strokeWidth={1.4} /> DELETE SPACE
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const PRIORITY_FILL: Record<ItemPriority, string> = {
  essential: "rgba(145,146,141,.55)",
  recommended: "rgba(145,146,141,.28)",
  optional: "rgba(194,163,107,.32)",
};

/** Top-down plan of the room with its contents laid out the way the configurator lays them out. */
function RoomPlan({ room, placed, eqById }: { room: { w: number; d: number }; placed: ReturnType<typeof pack>["placed"]; eqById: Map<string, CanvasEquipment> }) {
  const pad = 0.8;
  const lines = [];
  for (let x = 1; x < room.w; x++) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={room.d} />);
  for (let y = 1; y < room.d; y++) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={room.w} y2={y} />);
  return (
    <svg className="room-plan" viewBox={`${-pad} ${-pad} ${room.w + 2 * pad} ${room.d + 2 * pad}`} role="img" aria-label={`Plan of a ${room.w} by ${room.d} metre room`}>
      <rect x={0} y={0} width={room.w} height={room.d} fill="#2a2b2d" stroke="#d8d4cc" strokeWidth={0.08} />
      <g stroke="rgba(255,255,255,.05)" strokeWidth={0.02}>{lines}</g>
      {placed.map((p, i) => {
        const e = eqById.get(p.key);
        const small = Math.min(p.rw, p.rd);
        return (
          <g key={i}>
            <title>{e?.label}</title>
            <rect x={p.x} y={p.y} width={p.rw} height={p.rd} fill={PRIORITY_FILL[p.priority]} stroke="rgba(255,255,255,.45)" strokeWidth={0.02} />
            {small > 0.5 && (
              <text x={p.x + p.rw / 2} y={p.y + p.rd / 2} fontSize={Math.min(0.22, small / 3.2)} fill="rgba(255,255,255,.85)" textAnchor="middle" dominantBaseline="middle">
                {(e?.label ?? "").slice(0, Math.max(3, Math.floor(p.rw / 0.14)))}
              </text>
            )}
          </g>
        );
      })}
      <text x={room.w / 2} y={-0.3} fontSize={0.28} fill="rgba(255,255,255,.55)" textAnchor="middle">{room.w} M</text>
      <text x={-0.3} y={room.d / 2} fontSize={0.28} fill="rgba(255,255,255,.55)" textAnchor="middle" transform={`rotate(-90 ${-0.3} ${room.d / 2})`}>{room.d} M</text>
    </svg>
  );
}
