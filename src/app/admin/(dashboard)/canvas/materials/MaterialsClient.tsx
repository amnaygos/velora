"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { CanvasMaterial } from "@/types/canvas";
import { deleteRow, reorder, saveMaterial, setActive } from "../actions";
import { Drawer, ImageDrop, SaveState, Toggle, useSortable } from "../ui";

type Filter = "all" | "floor" | "walls" | "ceiling";
const SWATCH_M = 3; // a card shows 3 m of the surface

const blank = (): CanvasMaterial => ({
  id: "", key: "", label: "", image: null, tile_m: 2, tone: "#888888", effect: null, price_floor: null, price_walls: null,
  price_ceiling: null, floor_dry: true, floor_wet: false, floor_out: false, active: true, sort_order: 0,
});

/** A surface as it reads in the admin: texture repeating at its real size, or the flat effect for mirror/stretch. */
export function MaterialSurface({ m, metres = SWATCH_M }: { m: Pick<CanvasMaterial, "image" | "tile_m" | "tone" | "effect">; metres?: number }) {
  const src = m.image?.split("#")[0];
  const style: React.CSSProperties = src
    ? { backgroundImage: `url("${src}")`, backgroundSize: `${(m.tile_m / metres) * 100}% auto`, backgroundColor: m.tone }
    : { background: m.effect === "mirror" ? "linear-gradient(115deg, #7c848a, #d4dbe0 45%, #8a9298 60%, #b7bec4)" : m.effect === "stretch" ? "linear-gradient(180deg, #f6f6f4, #c9c9c4 70%, #e8e8e5)" : m.tone };
  return <span className={`surface${m.effect === "slats" ? " slats" : ""}`} style={style} />;
}

export default function MaterialsClient({ initial, usage }: { initial: CanvasMaterial[]; usage: Record<string, string[]> }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [last, setLast] = useState(initial);
  if (initial !== last) {
    setLast(initial);
    setList(initial);
  }
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<CanvasMaterial | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const offers = (m: CanvasMaterial, f: Filter) => f === "all" || m[`price_${f}` as const] !== null;
  const visible = list.filter((m) => offers(m, filter));
  const { dragId, bind } = useSortable(list, setList, (ids) =>
    startTransition(async () => {
      const r = await reorder("canvas_materials", ids);
      if (!r.ok) setError(r.error ?? "Couldn't save the order.");
    }), filter === "all");

  function quickSave(m: CanvasMaterial, patch: Partial<CanvasMaterial>) {
    const next = { ...m, ...patch };
    setList((l) => l.map((x) => (x.id === m.id ? next : x)));
    startTransition(async () => {
      const r = patch.active === undefined ? await saveMaterial(m.id, next) : await setActive("canvas_materials", m.id, Boolean(patch.active));
      if (!r.ok) setError(r.error ?? "Couldn't save.");
      else router.refresh();
    });
  }

  const count = (f: Filter) => list.filter((m) => offers(m, f)).length;
  const price = (v: number | null) => (v === null ? "—" : v.toLocaleString("en-US"));

  return (
    <>
      <div className="toolbar">
        <div className="filters">
          {(["all", "floor", "walls", "ceiling"] as Filter[]).map((f) => (
            <button key={f} type="button" className={`chip${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "ALL" : f.toUpperCase()} · {count(f)}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing(blank())}>
          <Plus size={13} strokeWidth={1.3} /> NEW MATERIAL
        </button>
      </div>
      <p className="dim tt-none mb-24" style={{ fontSize: 11, marginTop: -8 }}>
        {pending ? "Saving…" : filter === "all" ? "Drop a texture photo onto a swatch to replace it. Drag swatches to set the order clients see." : "Show all to change the order."} Prices are QAR per m² of the space they finish.
      </p>
      {error && <div className="login-error mb-24">{error}</div>}

      <div className="mat-grid">
        {visible.map((m) => (
          <article key={m.id} className={`mat-card${dragId === m.id ? " dragging" : ""}${m.active ? "" : " off"}`} {...bind(m.id)} onClick={() => setEditing(m)}>
            <div className="mat-swatch">
              <MaterialSurface m={m} />
              <ImageDrop
                value={null}
                onChange={(image, tone) => image && quickSave(m, tone ? { image, tone } : { image })}
                onTone={(tone) => setList((l) => l.map((x) => (x.id === m.id ? { ...x, tone } : x)))}
                maxEdge={1024}
                ratio="1 / 1"
                compact
                overlay
                clickable={false}
              />
            </div>
            <div className="mat-body">
              <div className="between">
                <b>{m.label}</b>
                <button type="button" className="icon-btn eq-tool" title={m.active ? "Hide from the configurator" : "Show in the configurator"} aria-label={m.active ? `Hide ${m.label}` : `Show ${m.label}`} onClick={(e) => { e.stopPropagation(); quickSave(m, { active: !m.active }); }}>
                  {m.active ? <EyeOff size={12} strokeWidth={1.4} /> : <Eye size={12} strokeWidth={1.4} />}
                </button>
              </div>
              <dl className="mat-prices tnum">
                <div><dt>Floor</dt><dd>{price(m.price_floor)}</dd></div>
                <div><dt>Walls</dt><dd>{price(m.price_walls)}</dd></div>
                <div><dt>Ceiling</dt><dd>{price(m.price_ceiling)}</dd></div>
              </dl>
              <div className="mat-tags">
                {m.price_floor !== null && m.floor_dry && <span>DRY</span>}
                {m.price_floor !== null && m.floor_wet && <span>WET</span>}
                {m.price_floor !== null && m.floor_out && <span>OUTDOOR</span>}
                {!m.active && <span className="off-tag">HIDDEN</span>}
              </div>
            </div>
          </article>
        ))}
        <button type="button" className="pf-add mat-add" onClick={() => setEditing(blank())}>
          <Plus size={26} strokeWidth={1.1} />
          <span>NEW MATERIAL</span>
        </button>
      </div>

      <MaterialDrawer
        item={editing}
        usedBy={editing ? usage[editing.key] ?? [] : []}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />
    </>
  );
}

function MaterialDrawer({ item, usedBy, onClose, onSaved }: { item: CanvasMaterial | null; usedBy: string[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<CanvasMaterial | null>(item);
  const [lastItem, setLastItem] = useState(item);
  if (item !== lastItem) {
    setLastItem(item);
    setForm(item);
  }
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  if (!form) return <Drawer open={false} title="" eyebrow="" onClose={onClose}>{null}</Drawer>;
  const set = (patch: Partial<CanvasMaterial>) => setForm((f) => (f ? { ...f, ...patch } : f));

  function save() {
    setError(null);
    startTransition(async () => {
      const r = await saveMaterial(form!.id || null, form!);
      if (!r.ok) setError(r.error ?? "Couldn't save.");
      else onSaved();
    });
  }
  function remove() {
    startTransition(async () => {
      const r = await deleteRow("canvas_materials", form!.id);
      if (!r.ok) setError(r.error ?? "Couldn't delete.");
      else onSaved();
    });
  }

  const surface = (key: "floor" | "walls" | "ceiling", title: string, hint: string) => {
    const field = `price_${key}` as const;
    const on = form[field] !== null;
    return (
      <div className={`surface-row${on ? " on" : ""}`}>
        <Toggle on={on} onChange={(v) => set({ [field]: v ? form[field] ?? 0 : null } as Partial<CanvasMaterial>)} title={title} hint={hint} />
        {on && (
          <label className="surface-price">
            <input type="number" min={0} step={10} value={form[field] ?? 0} onChange={(e) => set({ [field]: Number(e.target.value) } as Partial<CanvasMaterial>)} />
            <span>QAR / m²</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <Drawer
      open={Boolean(item)}
      eyebrow={form.id ? "MATERIAL" : "NEW MATERIAL"}
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
      <div className="label mb-16">TEXTURE · A 4 M SAMPLE</div>
      <div className="tex-preview">
        <MaterialSurface m={form} metres={4} />
        <ImageDrop value={null} onChange={(image) => image && set({ image })} onTone={(tone) => set({ tone })} maxEdge={1024} ratio="16 / 9" label={form.image ? "Drop a new texture" : "Drop a texture photo"} overlay />
      </div>
      <p className="field-hint mb-24">A seamless, straight-on photo works best. Its average colour becomes the tone used in flat views.</p>

      <div className="field">
        <label>Name <span className="req">*</span></label>
        <input type="text" className="tt-none" value={form.label} placeholder="Honed limestone" onChange={(e) => set({ label: e.target.value })} />
      </div>
      <div className="field">
        <label>One photo covers · {form.tile_m} m</label>
        <input type="range" min={0.4} max={6} step={0.1} value={form.tile_m} onChange={(e) => set({ tile_m: Number(e.target.value) })} />
        <p className="field-hint">Drag until the sample above looks right: large-format stone ≈ 2.4 m, planks ≈ 2 m, small tiles ≈ 1 m.</p>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Tone</label>
          <div className="flex items-center gap-12">
            <input type="color" value={form.tone} onChange={(e) => set({ tone: e.target.value })} aria-label="Tone" className="tone-input" />
            <span className="tnum dim tt-none">{form.tone}</span>
          </div>
        </div>
        <div className="field">
          <label>Effect</label>
          <select value={form.effect ?? ""} onChange={(e) => set({ effect: (e.target.value || null) as CanvasMaterial["effect"] })}>
            <option value="">None</option>
            <option value="slats">Slats (vertical lines)</option>
            <option value="mirror">Mirror</option>
            <option value="stretch">Stretch ceiling</option>
          </select>
        </div>
      </div>

      <div className="label mb-16">SOLD FOR</div>
      {surface("floor", "Floors", "Priced per m² of floor.")}
      {form.price_floor !== null && (
        <div className="filters mb-24" style={{ paddingLeft: 0 }}>
          {(
            [
              ["floor_dry", "Dry rooms"],
              ["floor_wet", "Wet rooms"],
              ["floor_out", "Outdoors"],
            ] as const
          ).map(([k, l]) => (
            <button key={k} type="button" className={`chip${form[k] ? " on" : ""}`} aria-pressed={form[k]} onClick={() => set({ [k]: !form[k] } as Partial<CanvasMaterial>)}>
              {l}
            </button>
          ))}
        </div>
      )}
      {surface("walls", "Walls", "Priced per m² of the room's footprint.")}
      {surface("ceiling", "Ceilings", "Priced per m² of the room's footprint.")}

      <div className="mt-24">
        <Toggle on={form.active} onChange={(active) => set({ active })} title="In the configurator" hint="Hidden finishes aren't offered to clients." />
      </div>
      {form.id && (
        <div className="mt-24">
          <p className="field-hint mb-16">{usedBy.length ? `Default for: ${usedBy.join(", ")}.` : "Not a default anywhere."}</p>
          {confirm ? (
            <div className="flex gap-8">
              <button type="button" className="btn btn-primary btn-sm" onClick={remove} disabled={pending}>DELETE</button>
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
