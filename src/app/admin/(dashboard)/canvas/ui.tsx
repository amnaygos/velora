"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { fileTone, uploadImage } from "@/components/admin/media/uploadImage";
import { TIERS, TIER_LABEL } from "@/types/canvas";

export const plainSrc = (ref: string | null | undefined) => (ref ? ref.split("#")[0] : null);

// ---------------------------------------------------------------- drag to reorder

/**
 * Native drag-and-drop reordering for a list or grid. Items move live under
 * the pointer; `onCommit` runs once on drop with the new order. Dragging a
 * file from the desktop never reorders (photo drop zones handle those).
 */
export function useSortable<T extends { id: string }>(
  items: T[],
  setItems: (next: T[]) => void,
  onCommit: (ids: string[]) => void,
  enabled = true
) {
  const [dragId, setDragId] = useState<string | null>(null);
  const before = useRef<string[]>([]);
  const latest = useRef(items);
  useEffect(() => {
    latest.current = items;
  }, [items]);

  const bind = (id: string) =>
    enabled
      ? {
          draggable: true,
          onDragStart: (e: React.DragEvent) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/x-sort", id);
            before.current = latest.current.map((i) => i.id);
            setDragId(id);
          },
          onDragOver: (e: React.DragEvent) => {
            if (!dragId) return;
            e.preventDefault();
            if (dragId === id) return;
            const next = [...latest.current];
            const from = next.findIndex((i) => i.id === dragId);
            const to = next.findIndex((i) => i.id === id);
            if (from < 0 || to < 0) return;
            next.splice(to, 0, next.splice(from, 1)[0]);
            setItems(next);
          },
          onDragEnd: () => {
            setDragId(null);
            const ids = latest.current.map((i) => i.id);
            if (ids.join() !== before.current.join()) onCommit(ids);
          },
        }
      : {};

  return { dragId, bind };
}

/** Moves an item one step earlier/later — the keyboard-friendly twin of dragging. */
export function moveBy<T>(list: T[], index: number, delta: number): T[] {
  const to = index + delta;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  next.splice(to, 0, next.splice(index, 1)[0]);
  return next;
}

// ---------------------------------------------------------------- photos

/**
 * A photo slot: drop a file on it or click to choose one. It uploads at once
 * and hands back the public URL. `tiled` shows the photo repeating, the way a
 * texture lies on a surface.
 */
export function ImageDrop({
  value,
  onChange,
  onTone,
  folder = "canvas",
  maxEdge = 1600,
  ratio = "4 / 3",
  tiled = 0,
  label = "Drop a photo",
  compact = false,
  overlay = false,
  clickable = true,
}: {
  value: string | null;
  /** The uploaded photo's URL (null when removed), and its average colour when `onTone` is set. */
  onChange: (url: string | null, tone?: string) => void;
  onTone?: (tone: string) => void;
  folder?: string;
  maxEdge?: number;
  ratio?: string;
  tiled?: number;
  label?: string;
  compact?: boolean;
  /** Sits invisibly over something else (a swatch) and only shows itself while a file is dragged over. */
  overlay?: boolean;
  clickable?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const src = plainSrc(value);

  async function take(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      let tone: string | undefined;
      if (onTone) {
        tone = await fileTone(file);
        onTone(tone);
      }
      onChange(plainSrc(await uploadImage(file, { folder, maxEdge })), tone);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className={`img-drop${compact ? " compact" : ""}${overlay ? " overlay" : ""}`}>
      <div
        className={`img-frame${over ? " over" : ""}${src ? " has" : ""}`}
        style={{
          aspectRatio: ratio,
          ...(src && tiled ? { backgroundImage: `url("${src}")`, backgroundSize: `${100 / tiled}% auto` } : {}),
        }}
        {...(clickable
          ? {
              role: "button",
              tabIndex: 0,
              "aria-label": src ? "Replace photo" : "Add a photo",
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                input.current?.click();
              },
              onKeyDown: (e: React.KeyboardEvent) => (e.key === "Enter" || e.key === " ") && input.current?.click(),
            }
          : {})}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("Files")) return;
          e.preventDefault();
          e.stopPropagation();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files?.length) return;
          e.preventDefault();
          e.stopPropagation();
          setOver(false);
          take(e.dataTransfer.files[0]);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src && !tiled ? <img src={src} alt="" draggable={false} /> : null}
        {!src && (
          <span className="img-empty">
            <ImagePlus size={compact ? 16 : 20} strokeWidth={1.1} />
            {!compact && <span>{label}</span>}
          </span>
        )}
        {over && <span className="img-hint">DROP TO UPLOAD</span>}
        {busy && (
          <span className="img-busy">
            <Loader2 size={16} className="spin" />
          </span>
        )}
        {src && !busy && (
          <button
            type="button"
            className="img-remove"
            aria-label="Remove photo"
            title="Remove photo"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            <Trash2 size={11} strokeWidth={1.5} />
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => take(e.target.files?.[0])} />
      {error && <p className="field-hint warn">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------- inputs

/** Essential · Premium · Signature prices side by side. */
export function PriceTriple({
  values,
  onChange,
  unit,
}: {
  values: [number, number, number];
  onChange: (next: [number, number, number]) => void;
  unit?: string;
}) {
  return (
    <div className="price-triple">
      {TIERS.map((t, i) => (
        <label key={t}>
          <span>{TIER_LABEL[t]}</span>
          <input
            type="number"
            min={0}
            step={50}
            value={Number.isFinite(values[i]) ? values[i] : 0}
            onChange={(e) => {
              const next = [...values] as [number, number, number];
              next[i] = Number(e.target.value);
              onChange(next);
            }}
          />
        </label>
      ))}
      {unit && <em>{unit}</em>}
    </div>
  );
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string; title?: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg w-full" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" title={o.title} aria-pressed={value === o.value} className={value === o.value ? "active" : ""} style={{ flex: 1 }} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, title, hint }: { on: boolean; onChange: (v: boolean) => void; title: string; hint?: string }) {
  return (
    <div className="toggle-row" onClick={() => onChange(!on)}>
      <span>
        <b>{title}</b>
        {hint && <small className="tt-none">{hint}</small>}
      </span>
      <button type="button" role="switch" aria-checked={on} aria-label={title} className="switch" onClick={(e) => { e.stopPropagation(); onChange(!on); }} />
    </div>
  );
}

// ---------------------------------------------------------------- drawer

export function Drawer({ open, title, eyebrow, onClose, children, foot }: { open: boolean; title: string; eyebrow: string; onClose: () => void; children: ReactNode; foot?: ReactNode }) {
  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`drawer drawer-wide${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow mb-16">{eyebrow}</div>
            <h2 style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>{title}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={15} strokeWidth={1.3} />
          </button>
        </div>
        <div className="drawer-body">{open ? children : null}</div>
        {foot && <div className="drawer-foot">{foot}</div>}
      </aside>
    </>
  );
}

/** "Saving…", the error, or a quiet confirmation. */
export function SaveState({ pending, error, saved }: { pending: boolean; error: string | null; saved: boolean }) {
  if (pending) return <span className="editor-state tt-none">Saving…</span>;
  if (error) return <span className="editor-state tt-none" style={{ color: "var(--amber)" }}>{error}</span>;
  if (saved) return <span className="editor-state tt-none">Saved — live in the configurator.</span>;
  return null;
}
