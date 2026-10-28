"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { EQUIPMENT_SHAPES, type CanvasEquipment } from "@/types/canvas";
import { qar } from "@/lib/canvasMath";
import { deleteRow, reorder, saveEquipment, setActive } from "../actions";
import { Drawer, ImageDrop, PriceTriple, SaveState, Toggle, useSortable } from "../ui";

const SHAPE_LABEL: Record<string, string> = {
  machine: "Machine", bike: "Bike", rig: "Rig / frame", bench: "Bench", lounger: "Lounger", locker: "Lockers", counter: "Counter / desk",
  table: "Table", shelf: "Rack / shelving", tank: "Plant / tank", washer: "Washer", bag: "Hanging bag", mat: "Mat (flat)", kit: "Kit / small",
};

const blank = (category: string): CanvasEquipment => ({
  id: "", key: "", label: "", category: category || "Cardio", image: null, width_m: 1, depth_m: 1.5, height_m: 1.2, clearance_m: 0.6,
  shape: "machine", price_essential: 0, price_premium: 0, price_signature: 0, note: null, active: true, sort_order: 0,
});

export default function EquipmentClient({ initial, usage }: { initial: CanvasEquipment[]; usage: Record<string, string[]> }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [last, setLast] = useState(initial);
  if (initial !== last) {
    setLast(initial);
    setList(initial);
  }
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CanvasEquipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const categories = useMemo(() => Array.from(new Set(list.map((e) => e.category))), [list]);
  const filtering = category !== "All" || query.trim() !== "";
  const visible = list.filter(
    (e) => (category === "All" || e.category === category) && e.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const { dragId, bind } = useSortable(list, setList, (ids) =>
    startTransition(async () => {
      const r = await reorder("canvas_equipment", ids);
      if (!r.ok) setError(r.error ?? "Couldn't save the order.");
    }), !filtering);

  function quickSave(item: CanvasEquipment, patch: Partial<CanvasEquipment>) {
    const next = { ...item, ...patch };
    setList((l) => l.map((e) => (e.id === item.id ? next : e)));
    startTransition(async () => {
      const r = patch.active === undefined ? await saveEquipment(item.id, next) : await setActive("canvas_equipment", item.id, Boolean(patch.active));
      if (!r.ok) setError(r.error ?? "Couldn't save.");
      else router.refresh();
    });
  }

  return (
    <>
      <div className="toolbar">
        <div className="filters">
          {["All", ...categories].map((c) => (
            <button key={c} type="button" className={`chip${category === c ? " on" : ""}`} onClick={() => setCategory(c)}>
              {c} · {c === "All" ? list.length : list.filter((e) => e.category === c).length}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-12">
          <label className="search-box">
            <Search size={13} strokeWidth={1.4} />
            <input type="search" placeholder="Find equipment" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find equipment" />
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing(blank(category === "All" ? "" : category))}>
            <Plus size={13} strokeWidth={1.3} /> NEW EQUIPMENT
          </button>
        </div>
      </div>
      <p className="dim tt-none mb-24" style={{ fontSize: 11, marginTop: -8 }}>
        {pending ? "Saving…" : filtering ? "Clear the filter to change the order." : "Drag cards to set the order. Drop a photo straight onto a card. Prices are per item, by Feel tier."}
      </p>
      {error && <div className="login-error mb-24">{error}</div>}

      <div className="eq-grid">
        {visible.map((e) => {
          const used = usage[e.id] ?? [];
          return (
            <article key={e.id} className={`eq-card${dragId === e.id ? " dragging" : ""}${e.active ? "" : " off"}`} {...bind(e.id)} onClick={() => setEditing(e)}>
              <ImageDrop value={e.image} onChange={(image) => quickSave(e, { image })} ratio="4 / 3" label="Drop a photo" />
              <div className="eq-body">
                <div className="between">
                  <span className="cat">{e.category}</span>
                  <span className="flex items-center gap-8" onClick={(ev) => ev.stopPropagation()}>
                    {!e.active && <span className="pill pill-amber">HIDDEN</span>}
                    <button type="button" className="icon-btn eq-tool" title={e.active ? "Hide from the configurator" : "Show in the configurator"} aria-label={e.active ? `Hide ${e.label}` : `Show ${e.label}`} onClick={() => quickSave(e, { active: !e.active })}>
                      {e.active ? <EyeOff size={12} strokeWidth={1.4} /> : <Eye size={12} strokeWidth={1.4} />}
                    </button>
                  </span>
                </div>
                <div className="nm">
                  {!filtering && <GripVertical size={12} strokeWidth={1.4} className="pf-grip" aria-hidden="true" />}
                  {e.label}
                </div>
                <div className="meta tnum">
                  <span>{e.width_m} × {e.depth_m} m</span>
                  <span>{used.length ? `in ${used.length} space${used.length > 1 ? "s" : ""}` : "not used yet"}</span>
                </div>
                <div className="eq-prices tnum">
                  <span>{qar(e.price_essential)}</span>
                  <span>{qar(e.price_premium)}</span>
                  <span>{qar(e.price_signature)}</span>
                </div>
              </div>
            </article>
          );
        })}
        <button type="button" className="pf-add eq-add" onClick={() => setEditing(blank(category === "All" ? "" : category))}>
          <Plus size={26} strokeWidth={1.1} />
          <span>NEW EQUIPMENT</span>
        </button>
      </div>

      <EquipmentDrawer
        item={editing}
        categories={categories}
        usedIn={editing ? usage[editing.id] ?? [] : []}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />
    </>
  );
}

function EquipmentDrawer({
  item,
  categories,
  usedIn,
  onClose,
  onSaved,
}: {
  item: CanvasEquipment | null;
  categories: string[];
  usedIn: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CanvasEquipment | null>(item);
  const [lastItem, setLastItem] = useState(item);
  if (item !== lastItem) {
    setLastItem(item);
    setForm(item);
  }
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  if (!form) return <Drawer open={false} title="" eyebrow="" onClose={onClose}>{null}</Drawer>;
  const set = (patch: Partial<CanvasEquipment>) => setForm((f) => (f ? { ...f, ...patch } : f));

  function save() {
    setError(null);
    startTransition(async () => {
      const r = await saveEquipment(form!.id || null, form!);
      if (!r.ok) setError(r.error ?? "Couldn't save.");
      else onSaved();
    });
  }
  function remove() {
    startTransition(async () => {
      const r = await deleteRow("canvas_equipment", form!.id);
      if (!r.ok) setError(r.error ?? "Couldn't delete.");
      else onSaved();
    });
  }

  return (
    <Drawer
      open={Boolean(item)}
      eyebrow={form.id ? "EQUIPMENT" : "NEW EQUIPMENT"}
      title={form.label || "Untitled"}
      onClose={onClose}
      foot={
        <>
          <button type="button" className="btn btn-primary w-full" style={{ justifyContent: "center" }} onClick={save} disabled={pending}>
            {form.id ? "SAVE" : "ADD TO THE CATALOG"}
          </button>
          <SaveState pending={pending} error={error} saved={false} />
        </>
      }
    >
      <ImageDrop value={form.image} onChange={(image) => set({ image })} ratio="16 / 10" label="Drop a product photo" />
      <div className="field mt-24">
        <label>Name <span className="req">*</span></label>
        <input type="text" className="tt-none" value={form.label} placeholder="Treadmill" onChange={(e) => set({ label: e.target.value })} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Category</label>
          <input type="text" className="tt-none" list="eq-categories" value={form.category} onChange={(e) => set({ category: e.target.value })} />
          <datalist id="eq-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div className="field">
          <label>Drawn as</label>
          <select value={form.shape} onChange={(e) => set({ shape: e.target.value as CanvasEquipment["shape"] })}>
            {EQUIPMENT_SHAPES.map((s) => <option key={s} value={s}>{SHAPE_LABEL[s] ?? s}</option>)}
          </select>
        </div>
      </div>

      <div className="label mb-16">FOOTPRINT</div>
      <FootprintEditor
        w={form.width_m}
        d={form.depth_m}
        clearance={form.clearance_m}
        onChange={(w, d) => set({ width_m: w, depth_m: d })}
      />
      <div className="dims-row">
        {(
          [
            ["width_m", "Width", 0.1],
            ["depth_m", "Depth", 0.1],
            ["height_m", "Height", 0.1],
            ["clearance_m", "Clearance", 0.1],
          ] as const
        ).map(([k, l, step]) => (
          <label key={k}>
            <span>{l} (m)</span>
            <input type="number" min={0} step={step} value={form[k]} onChange={(e) => set({ [k]: Number(e.target.value) } as Partial<CanvasEquipment>)} />
          </label>
        ))}
      </div>
      <p className="field-hint mb-24">Clearance is the free floor kept around it, for use and for walking past.</p>

      <div className="label mb-16">PRICE PER ITEM · QAR</div>
      <PriceTriple
        values={[form.price_essential, form.price_premium, form.price_signature]}
        onChange={([a, b, c]) => set({ price_essential: a, price_premium: b, price_signature: c })}
      />
      <p className="field-hint mb-24">The configurator uses the column of the Feel the client picks.</p>

      <div className="field">
        <label>Note</label>
        <input type="text" className="tt-none" value={form.note ?? ""} placeholder="Brand, model, supplier…" onChange={(e) => set({ note: e.target.value })} />
      </div>
      <Toggle on={form.active} onChange={(active) => set({ active })} title="In the configurator" hint="Hidden equipment is left out of every space." />

      {form.id && (
        <div className="mt-24">
          <p className="field-hint mb-16">{usedIn.length ? `Used in: ${usedIn.join(", ")}.` : "Not in any space yet — add it from a space's contents."}</p>
          {confirm ? (
            <div className="flex gap-8">
              <button type="button" className="btn btn-primary btn-sm" onClick={remove} disabled={pending}>
                DELETE{usedIn.length ? ` AND REMOVE FROM ${usedIn.length} SPACE${usedIn.length > 1 ? "S" : ""}` : ""}
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(false)}>KEEP IT</button>
            </div>
          ) : (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(true)}>
              <Trash2 size={12} strokeWidth={1.4} /> DELETE
            </button>
          )}
        </div>
      )}
    </Drawer>
  );
}

/** A top-down footprint with its clearance; drag the corner to resize. */
export function FootprintEditor({ w, d, clearance, onChange }: { w: number; d: number; clearance: number; onChange: (w: number, d: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  // The drawing scale holds still while dragging, so the corner stays under the pointer.
  const [held, setHeld] = useState<number | null>(null);
  const span = held ?? Math.max(4, Math.ceil((Math.max(w, d) + 2 * clearance + 0.6) / 2) * 2);
  const ox = (span - w) / 2;
  const oy = (span - d) / 2;
  const snap = (v: number) => Math.max(0.2, Math.round(v * 20) / 20);

  function drag(e: React.PointerEvent) {
    const el = svg.current;
    if (!el) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setHeld(span);
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * span;
      const y = ((ev.clientY - r.top) / r.height) * span;
      onChange(snap((x - span / 2) * 2), snap((y - span / 2) * 2));
    };
    const up = () => {
      setHeld(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const grid = [];
  for (let i = 0; i <= span; i += 0.5) grid.push(i);
  return (
    <svg ref={svg} className="footprint" viewBox={`0 0 ${span} ${span}`} role="img" aria-label={`Footprint ${w} by ${d} metres`}>
      {grid.map((g) => (
        <g key={g} stroke={g % 1 === 0 ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.035)"} strokeWidth={0.01}>
          <line x1={g} y1={0} x2={g} y2={span} />
          <line x1={0} y1={g} x2={span} y2={g} />
        </g>
      ))}
      <rect x={ox - clearance} y={oy - clearance} width={w + 2 * clearance} height={d + 2 * clearance} fill="rgba(145,146,141,.08)" stroke="rgba(145,146,141,.5)" strokeWidth={0.015} strokeDasharray="0.08 0.06" />
      <rect x={ox} y={oy} width={w} height={d} fill="rgba(145,146,141,.35)" stroke="#d9dad4" strokeWidth={0.02} />
      <text x={span / 2} y={oy - clearance - 0.12} textAnchor="middle" fontSize={0.2} fill="rgba(255,255,255,.6)">{w} M</text>
      <text x={ox - clearance - 0.12} y={span / 2} textAnchor="middle" fontSize={0.2} fill="rgba(255,255,255,.6)" transform={`rotate(-90 ${ox - clearance - 0.12} ${span / 2})`}>{d} M</text>
      <circle cx={ox + w} cy={oy + d} r={0.13} fill="#ecebe6" stroke="#91928D" strokeWidth={0.03} className="fp-handle" onPointerDown={drag} />
    </svg>
  );
}

