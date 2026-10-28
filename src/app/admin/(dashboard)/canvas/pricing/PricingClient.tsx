"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GripVertical, Plus, Trash2, X } from "lucide-react";
import {
  SYSTEM_BASIS,
  TIERS,
  TIER_LABEL,
  type CanvasFeature,
  type CanvasMaterial,
  type CanvasSettings,
  type PricedOption,
  type Tier,
  type TierFinishes,
} from "@/types/canvas";
import { qar } from "@/lib/canvasMath";
import { deleteRow, reorder, saveCanvasSettings, saveFeature, setActive } from "../actions";
import { MaterialSurface } from "../materials/MaterialsClient";
import { ImageDrop, PriceTriple, SaveState, moveBy, useSortable } from "../ui";

type Slot = { path: string; label: string; accepts: (m: CanvasMaterial) => boolean };
const SLOTS: Slot[] = [
  { path: "dry.floor", label: "Dry floor", accepts: (m) => m.price_floor !== null && m.floor_dry },
  { path: "dry.walls", label: "Dry walls", accepts: (m) => m.price_walls !== null },
  { path: "dry.ceiling", label: "Dry ceiling", accepts: (m) => m.price_ceiling !== null },
  { path: "wet.floor", label: "Wet floor", accepts: (m) => m.price_floor !== null && m.floor_wet },
  { path: "wet.walls", label: "Wet walls", accepts: (m) => m.price_walls !== null },
  { path: "wet.ceiling", label: "Wet ceiling", accepts: (m) => m.price_ceiling !== null },
  { path: "out.floor", label: "Outdoor ground", accepts: (m) => m.price_floor !== null && m.floor_out },
  { path: "hall", label: "Walkways", accepts: (m) => m.price_floor !== null && m.floor_dry },
];

const getPath = (t: TierFinishes, path: string): string => path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], t) as string;
function setPath(t: TierFinishes, path: string, value: string): TierFinishes {
  const [a, b] = path.split(".");
  if (!b) return { ...t, [a]: value };
  return { ...t, [a]: { ...(t[a as "dry"] as object), [b]: value } } as TierFinishes;
}

export default function PricingClient({ settings, materials, features }: { settings: CanvasSettings; materials: CanvasMaterial[]; features: CanvasFeature[] }) {
  const router = useRouter();
  const [form, setForm] = useState<CanvasSettings>(settings);
  const [saved, setSaved] = useState(() => JSON.stringify(settings));
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(form) !== saved;
  const byKey = useMemo(() => new Map(materials.map((m) => [m.key, m])), [materials]);

  const update = (next: CanvasSettings) => {
    setForm(next);
    setJustSaved(false);
  };

  function save() {
    setError(null);
    startTransition(async () => {
      const r = await saveCanvasSettings(form);
      if (!r.ok) return setError(r.error ?? "Couldn't save.");
      setSaved(JSON.stringify(form));
      setJustSaved(true);
      router.refresh();
    });
  }

  // ---------------------------------------------------------- material drag onto tier slots
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overSlot, setOverSlot] = useState<string | null>(null);
  const [refused, setRefused] = useState<string | null>(null);

  function assign(tier: Tier, slot: Slot, key: string) {
    const m = byKey.get(key);
    if (!m || !slot.accepts(m)) {
      setRefused(`${tier}:${slot.path}`);
      setTimeout(() => setRefused(null), 900);
      return;
    }
    update({ ...form, tiers: { ...form.tiers, [tier]: setPath(form.tiers[tier], slot.path, key) } });
  }

  return (
    <>
      <div className="editor-bar sticky">
        <span className="dim tt-none" style={{ fontSize: 11, flex: 1 }}>
          Feel tiers, glass, lighting, systems and fees save together. Features save one by one, below.
        </span>
        {justSaved && !dirty ? <SaveState pending={false} error={null} saved /> : <SaveState pending={pending} error={error} saved={false} />}
        {dirty && !pending && <span className="editor-state tt-none">Unsaved changes</span>}
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!dirty || pending}>SAVE PRICING</button>
      </div>

      {/* ---------------- Feel tiers */}
      <div className="panel mb-24">
        <div className="panel-head">
          <h3>FEEL TIERS</h3>
          <span className="dim tt-none" style={{ fontSize: 11 }}>The finishes each Feel starts every space with. Drag a swatch onto a slot.</span>
        </div>
        <div className="palette" aria-label="Materials">
          {materials.filter((m) => m.active).map((m) => (
            <div
              key={m.key}
              className={`palette-swatch${dragKey === m.key ? " dragging" : ""}`}
              draggable
              title={m.label}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.setData("text/x-material", m.key);
                setDragKey(m.key);
              }}
              onDragEnd={() => {
                setDragKey(null);
                setOverSlot(null);
              }}
            >
              <MaterialSurface m={m} metres={2} />
              <span>{m.label}</span>
            </div>
          ))}
        </div>
        <div className="tiers">
          {TIERS.map((tier) => {
            const t = form.tiers[tier];
            return (
              <section key={tier} className="tier-col">
                <header>
                  <input className="tier-name" value={t.label} aria-label={`${TIER_LABEL[tier]} name`} onChange={(e) => update({ ...form, tiers: { ...form.tiers, [tier]: { ...t, label: e.target.value } } })} />
                  <input className="tier-line tt-none" value={t.line} aria-label={`${TIER_LABEL[tier]} description`} onChange={(e) => update({ ...form, tiers: { ...form.tiers, [tier]: { ...t, line: e.target.value } } })} />
                </header>
                {SLOTS.map((slot) => {
                  const key = getPath(t, slot.path);
                  const m = byKey.get(key);
                  const id = `${tier}:${slot.path}`;
                  const acceptsDrag = dragKey ? slot.accepts(byKey.get(dragKey)!) : false;
                  return (
                    <div
                      key={slot.path}
                      className={`slot${overSlot === id ? (acceptsDrag ? " over" : " no") : ""}${refused === id ? " refused" : ""}${dragKey && acceptsDrag ? " can" : ""}`}
                      onDragOver={(e) => {
                        if (!dragKey) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = acceptsDrag ? "copy" : "none";
                        setOverSlot(id);
                      }}
                      onDragLeave={() => setOverSlot((s) => (s === id ? null : s))}
                      onDrop={(e) => {
                        e.preventDefault();
                        setOverSlot(null);
                        const k = e.dataTransfer.getData("text/x-material") || dragKey;
                        if (k) assign(tier, slot, k);
                      }}
                    >
                      <span className="slot-swatch">{m ? <MaterialSurface m={m} metres={2} /> : null}</span>
                      <span className="slot-text">
                        <small>{slot.label}</small>
                        <select value={key} aria-label={`${TIER_LABEL[tier]} ${slot.label}`} onChange={(e) => assign(tier, slot, e.target.value)}>
                          {!m && <option value={key}>Missing: {key}</option>}
                          {materials.filter((x) => x.active && slot.accepts(x)).map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
                        </select>
                      </span>
                    </div>
                  );
                })}
                <div className="slot">
                  <span className="slot-text full">
                    <small>Glass partitions</small>
                    <select value={t.glass} onChange={(e) => update({ ...form, tiers: { ...form.tiers, [tier]: { ...t, glass: e.target.value } } })}>
                      {form.glass.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                    </select>
                  </span>
                </div>
                <div className="slot">
                  <span className="slot-text full">
                    <small>Lighting</small>
                    <select value={t.lighting} onChange={(e) => update({ ...form, tiers: { ...form.tiers, [tier]: { ...t, lighting: e.target.value } } })}>
                      {form.lighting.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
                    </select>
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="grid grid-2 gap-24 mb-24">
        <OptionList
          title="GLASS PARTITIONS"
          hint="QAR per m² of glazed partition (about a third of a room's footprint)."
          options={form.glass}
          used={new Set(TIERS.map((t) => form.tiers[t].glass))}
          onChange={(glass) => update({ ...form, glass })}
        />
        <OptionList
          title="LIGHTING"
          hint="QAR per m² of the space it lights."
          options={form.lighting}
          used={new Set(TIERS.map((t) => form.tiers[t].lighting))}
          onChange={(lighting) => update({ ...form, lighting })}
        />
      </div>

      <div className="grid cols-main gap-24 mb-24">
        <div className="panel">
          <div className="panel-head">
            <h3>SYSTEMS</h3>
            <span className="dim tt-none" style={{ fontSize: 11 }}>Suggested automatically when the plan needs them. Price = base + rate × what it&apos;s charged on.</span>
          </div>
          <div className="table-wrap">
            <table className="sys-table">
              <thead>
                <tr><th>SYSTEM</th><th>CHARGED</th><th className="right">BASE · QAR</th><th className="right">RATE · QAR</th></tr>
              </thead>
              <tbody>
                {Object.entries(form.systems).map(([key, s]) => (
                  <tr key={key}>
                    <td><input className="tt-none" value={s.label} aria-label={`${key} name`} onChange={(e) => update({ ...form, systems: { ...form.systems, [key]: { ...s, label: e.target.value } } })} /></td>
                    <td className="dim tt-none sys-basis">{SYSTEM_BASIS[key] ?? "—"}</td>
                    <td className="right"><input type="number" min={0} step={1000} value={s.base} aria-label={`${s.label} base`} onChange={(e) => update({ ...form, systems: { ...form.systems, [key]: { ...s, base: Number(e.target.value) } } })} /></td>
                    <td className="right"><input type="number" min={0} step={10} value={s.rate} aria-label={`${s.label} rate`} onChange={(e) => update({ ...form, systems: { ...form.systems, [key]: { ...s, rate: Number(e.target.value) } } })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel panel-pad">
          <div className="label mb-24">FEES</div>
          <div className="field">
            <label>Design, management & supervision · {Math.round(form.fees.design * 100)}%</label>
            <input type="range" min={0} max={0.3} step={0.005} value={form.fees.design} onChange={(e) => update({ ...form, fees: { ...form.fees, design: Number(e.target.value) } })} />
            <p className="field-hint">Added on top of everything else.</p>
          </div>
          <div className="field">
            <label>Estimate range · ±{Math.round(form.fees.range * 100)}%</label>
            <input type="range" min={0} max={0.3} step={0.01} value={form.fees.range} onChange={(e) => update({ ...form, fees: { ...form.fees, range: Number(e.target.value) } })} />
            <p className="field-hint">The configurator shows a range, not a single number.</p>
          </div>
        </div>
      </div>

      <Features initial={features} />
    </>
  );
}

// ---------------------------------------------------------- glass / lighting

function OptionList({ title, hint, options, used, onChange }: { title: string; hint: string; options: PricedOption[]; used: Set<string>; onChange: (next: PricedOption[]) => void }) {
  const rows = options.map((o) => ({ ...o, id: o.key }));
  const { dragId, bind } = useSortable(rows, (next) => onChange(next.map((o) => ({ key: o.key, label: o.label, price: o.price }))), () => {});
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange([...options, { key: `option-${options.length + 1}`, label: "New option", price: 0 }])}>
          <Plus size={12} strokeWidth={1.4} /> ADD
        </button>
      </div>
      <div className="panel-pad">
        <p className="dim tt-none mb-16" style={{ fontSize: 11 }}>{hint}</p>
        {rows.map((o, index) => (
          <div key={o.id} className={`option-row${dragId === o.id ? " dragging" : ""}`} {...bind(o.id)}>
            <GripVertical size={12} strokeWidth={1.4} className="pf-grip" aria-hidden="true" />
            <input className="tt-none" value={o.label} aria-label="Option name" onChange={(e) => onChange(options.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))} />
            <input type="number" min={0} step={10} value={o.price} aria-label={`${o.label} price`} onChange={(e) => onChange(options.map((x, i) => (i === index ? { ...x, price: Number(e.target.value) } : x)))} />
            <button type="button" className="icon-btn" aria-label="Move up" title="Move up" disabled={index === 0} onClick={() => onChange(moveBy(options, index, -1))}>↑</button>
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove ${o.label}`}
              title={used.has(o.key) ? "A Feel tier uses it" : "Remove"}
              disabled={used.has(o.key) || options.length <= 1}
              onClick={() => onChange(options.filter((_, i) => i !== index))}
            >
              <X size={12} strokeWidth={1.4} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------- features

const blankFeature = (): CanvasFeature => ({
  id: "", key: "", label: "", mode: "toggle", max_count: 1, location: "any", image: null,
  price_essential: 0, price_premium: 0, price_signature: 0, active: true, sort_order: 0,
});

function Features({ initial }: { initial: CanvasFeature[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [last, setLast] = useState(initial);
  const [saved, setSaved] = useState<Record<string, string>>(() => Object.fromEntries(initial.map((f) => [f.id, JSON.stringify(f)])));
  // Fresh server data never overwrites a card that's being edited, or a new card not yet saved.
  if (initial !== last) {
    setLast(initial);
    const mine = new Map(list.filter((f) => f.id).map((f) => [f.id, f]));
    setList([
      ...initial.map((f) => {
        const local = mine.get(f.id);
        return local && saved[f.id] !== JSON.stringify(local) ? local : f;
      }),
      ...list.filter((f) => !f.id),
    ]);
    setSaved(Object.fromEntries(initial.map((f) => [f.id, JSON.stringify(f)])));
  }
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { dragId, bind } = useSortable(list.filter((f) => f.id), (next) => setList([...next, ...list.filter((f) => !f.id)]), (ids) =>
    startTransition(async () => {
      const r = await reorder("canvas_features", ids);
      if (!r.ok) setError(r.error ?? "Couldn't save the order.");
    }));

  const patch = (index: number, p: Partial<CanvasFeature>) => setList((l) => l.map((f, i) => (i === index ? { ...f, ...p } : f)));

  function save(f: CanvasFeature, index: number) {
    setError(null);
    startTransition(async () => {
      const r = await saveFeature(f.id || null, f);
      if (!r.ok) return setError(r.error ?? "Couldn't save.");
      const next = { ...f, id: r.id ?? f.id, key: r.key ?? f.key };
      patch(index, next);
      setSaved((s) => ({ ...s, [next.id]: JSON.stringify(next) }));
      router.refresh();
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>FEATURES</h3>
        <span className="flex items-center gap-12">
          <span className="dim tt-none" style={{ fontSize: 11 }}>{pending ? "Saving…" : "Extras a client adds to a space. Drag to reorder; drop a photo on a card."}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setList((l) => [...l, blankFeature()])}>
            <Plus size={12} strokeWidth={1.4} /> NEW FEATURE
          </button>
        </span>
      </div>
      {error && <div className="login-error" style={{ margin: "16px 28px 0" }}>{error}</div>}
      <div className="feature-grid">
        {list.map((f, index) => {
          const isDirty = !f.id || saved[f.id] !== JSON.stringify(f);
          return (
            <article key={f.id || `new-${index}`} className={`feature-card${dragId === f.id ? " dragging" : ""}${f.active ? "" : " off"}`} {...(f.id ? bind(f.id) : {})}>
              <ImageDrop value={f.image} onChange={(image) => patch(index, { image })} ratio="16 / 9" compact />
              <div className="feature-body">
                <input className="feature-name tt-none" value={f.label} placeholder="Feature name" aria-label="Feature name" onChange={(e) => patch(index, { label: e.target.value })} />
                <div className="feature-opts">
                  <select value={f.mode} aria-label="Added as" onChange={(e) => patch(index, { mode: e.target.value as CanvasFeature["mode"], max_count: e.target.value === "toggle" ? 1 : Math.max(2, f.max_count) })}>
                    <option value="toggle">On / off</option>
                    <option value="count">A number of</option>
                  </select>
                  {f.mode === "count" && <input type="number" min={1} max={99} value={f.max_count} aria-label="Up to" title="Up to" onChange={(e) => patch(index, { max_count: Number(e.target.value) })} />}
                  <select value={f.location} aria-label="Where" onChange={(e) => patch(index, { location: e.target.value as CanvasFeature["location"] })}>
                    <option value="any">Anywhere</option>
                    <option value="in">Indoors</option>
                    <option value="out">Outdoors</option>
                  </select>
                </div>
                <PriceTriple values={[f.price_essential, f.price_premium, f.price_signature]} onChange={([a, b, c]) => patch(index, { price_essential: a, price_premium: b, price_signature: c })} />
                <div className="feature-foot">
                  <span className="tnum dim">{f.mode === "count" ? `each · up to ${f.max_count}` : "each"} · {qar(f.price_premium)} premium</span>
                  <span className="flex gap-8">
                    {f.id && (
                      <button type="button" className="icon-btn" aria-label={f.active ? `Hide ${f.label}` : `Show ${f.label}`} title={f.active ? "Hide from the configurator" : "Show in the configurator"}
                        onClick={() => {
                          patch(index, { active: !f.active });
                          startTransition(async () => {
                            await setActive("canvas_features", f.id, !f.active);
                            setSaved((s) => ({ ...s, [f.id]: JSON.stringify({ ...f, active: !f.active }) }));
                          });
                        }}>
                        {f.active ? <EyeOff size={12} strokeWidth={1.4} /> : <Eye size={12} strokeWidth={1.4} />}
                      </button>
                    )}
                    <button type="button" className="icon-btn" aria-label={`Delete ${f.label || "feature"}`} title="Delete"
                      onClick={() => {
                        if (!f.id) return setList((l) => l.filter((_, i) => i !== index));
                        startTransition(async () => {
                          const r = await deleteRow("canvas_features", f.id);
                          if (!r.ok) setError(r.error ?? "Couldn't delete.");
                          else setList((l) => l.filter((x) => x.id !== f.id));
                        });
                      }}>
                      <Trash2 size={12} strokeWidth={1.4} />
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" disabled={!isDirty || pending} onClick={() => save(f, index)}>SAVE</button>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="field-hint" style={{ padding: "0 28px 22px" }}>New features are priced in the configurator; the built-in ones (planters, skylight, trees…) are also drawn in 3D.</p>
    </div>
  );
}
