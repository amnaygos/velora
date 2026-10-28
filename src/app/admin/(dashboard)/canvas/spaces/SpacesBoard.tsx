"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import type { CanvasSpace } from "@/types/canvas";
import { qar } from "@/lib/canvasMath";
import { moveSpace } from "../actions";
import { Seg } from "../ui";

type Thumb = { label: string; image: string | null };

/** Groups in the order their first space appears — the order the configurator's library shows them. */
function groupsOf(spaces: CanvasSpace[]) {
  const out: string[] = [];
  for (const s of spaces) if (!out.includes(s.group_name)) out.push(s.group_name);
  return out;
}

export default function SpacesBoard({
  initial,
  counts,
  thumbs,
}: {
  initial: CanvasSpace[];
  counts: Record<string, number>;
  thumbs: Record<string, Thumb[]>;
}) {
  const router = useRouter();
  const [spaces, setSpaces] = useState(initial);
  const [last, setLast] = useState(initial);
  if (initial !== last) {
    setLast(initial);
    setSpaces(initial);
  }
  const [where, setWhere] = useState<"in" | "out">("in");
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const startGroup = useRef<string | null>(null);
  const startOrder = useRef<string[]>([]);
  const newGroupInput = useRef<HTMLInputElement>(null);
  // A card moved to another column is re-created there, so its own dragend never fires:
  // the drop is committed from a window listener that reads the latest state.
  const latest = useRef(spaces);
  const dragging = useRef<string | null>(null);
  useEffect(() => {
    latest.current = spaces;
  }, [spaces]);

  const here = spaces.filter((s) => s.location === where);
  const groups = useMemo(() => groupsOf(here), [here]);
  const q = query.trim().toLowerCase();
  const searching = q !== "";

  /** Puts the dragged card into `group`, before `beforeId` (or at the end). */
  function place(group: string, beforeId: string | null) {
    const id = dragging.current;
    if (!id) return;
    const list = latest.current;
    const moving = list.find((s) => s.id === id);
    if (!moving || (moving.group_name === group && beforeId === id)) return;
    const rest = list.filter((s) => s.id !== id);
    const moved = { ...moving, group_name: group };
    let at: number;
    if (beforeId) at = rest.findIndex((s) => s.id === beforeId);
    else {
      // end of the group, or after the last space of this location if the group is new
      const lastInGroup = rest.map((s) => s.location === where && s.group_name === group).lastIndexOf(true);
      at = lastInGroup >= 0 ? lastInGroup + 1 : rest.map((s) => s.location === where).lastIndexOf(true) + 1;
    }
    rest.splice(at < 0 ? rest.length : at, 0, moved);
    latest.current = rest; // the drop commits before React re-renders
    setSpaces(rest);
  }

  function commit() {
    const moved = latest.current.find((s) => s.id === dragging.current);
    dragging.current = null;
    setDragId(null);
    if (!moved) return;
    const ids = latest.current.map((s) => s.id);
    if (moved.group_name === startGroup.current && ids.join() === startOrder.current.join()) return;
    startTransition(async () => {
      const r = await moveSpace(moved.id, moved.group_name, ids);
      if (!r.ok) {
        setError(r.error ?? "Couldn't move it.");
        setSpaces(initial);
      } else router.refresh();
    });
  }

  const dragProps = (s: CanvasSpace) =>
    searching
      ? {}
      : {
          draggable: true,
          onDragStart: (e: React.DragEvent) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/x-space", s.id);
            startGroup.current = s.group_name;
            startOrder.current = spaces.map((x) => x.id);
            dragging.current = s.id;
            setDragId(s.id);
            window.addEventListener("dragend", commit, { once: true });
          },
          onDragOver: (e: React.DragEvent) => {
            if (!dragId) return;
            e.preventDefault();
            e.stopPropagation();
            if (dragId !== s.id) place(s.group_name, s.id);
          },
        };

  const columnDrop = (group: string) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!dragId) return;
      e.preventDefault();
      const moving = latest.current.find((s) => s.id === dragId);
      if (moving && moving.group_name !== group) place(group, null);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      commit();
    },
  });

  return (
    <>
      <div className="toolbar">
        <div style={{ width: 280 }}>
          <Seg
            label="Indoor or outdoor"
            value={where}
            onChange={setWhere}
            options={[
              { value: "in", label: `INDOOR · ${spaces.filter((s) => s.location === "in").length}` },
              { value: "out", label: `OUTDOOR · ${spaces.filter((s) => s.location === "out").length}` },
            ]}
          />
        </div>
        <div className="flex items-center gap-12">
          <label className="search-box">
            <Search size={13} strokeWidth={1.4} />
            <input type="search" placeholder="Find a space" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find a space" />
          </label>
          <Link href={`/admin/canvas/spaces/new?location=${where}`} className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={1.3} /> NEW SPACE
          </Link>
        </div>
      </div>
      <p className="dim tt-none mb-24" style={{ fontSize: 11, marginTop: -8 }}>
        {pending
          ? "Saving…"
          : searching
            ? "Clear the search to move spaces."
            : "Drag a card to reorder it or move it to another group. The configurator's library shows them in this order. Open a card to set what it contains."}
      </p>
      {error && <div className="login-error mb-24">{error}</div>}

      <div className="space-board">
        {groups.map((group) => {
          const cards = here.filter((s) => s.group_name === group && (!searching || s.label.toLowerCase().includes(q)));
          if (searching && !cards.length) return null;
          return (
            <section key={group} className="space-col" {...columnDrop(group)} aria-label={group}>
              <header>
                <b>{group}</b>
                <span className="tnum">{cards.length}</span>
              </header>
              <div className="space-col-body">
                {cards.map((s) => (
                  <SpaceCard key={s.id} s={s} count={counts[s.id] ?? 0} thumbs={thumbs[s.id] ?? []} dragging={dragId === s.id} {...dragProps(s)} />
                ))}
                <Link className="space-col-add" href={`/admin/canvas/spaces/new?location=${where}&group=${encodeURIComponent(group)}`}>
                  <Plus size={12} strokeWidth={1.4} /> ADD TO {group.toUpperCase()}
                </Link>
              </div>
            </section>
          );
        })}
        {!searching && (
          <section
            className={`space-col space-col-new${dragId ? " ready" : ""}`}
            onDragOver={(e) => {
              if (!dragId) return;
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const name = newGroup.trim();
              if (!name) {
                setError("Name the new group first, then drop a space on it.");
                newGroupInput.current?.focus();
                return;
              }
              place(name, null);
              commit();
              setNewGroup("");
            }}
          >
            <header>
              <b>NEW GROUP</b>
            </header>
            <div className="space-col-body">
              <div className="field" style={{ marginBottom: 12 }}>
                <input ref={newGroupInput} type="text" className="tt-none" placeholder="Name it, then drop a space here" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
              </div>
              <p className="field-hint">A group appears in the configurator once a space is in it.</p>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function SpaceCard({
  s,
  count,
  thumbs,
  dragging,
  ...drag
}: {
  s: CanvasSpace;
  count: number;
  thumbs: Thumb[];
  dragging: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const unit = s.sizing === "unit";
  return (
    <Link href={`/admin/canvas/spaces/${s.id}`} className={`space-card${dragging ? " dragging" : ""}${s.active ? "" : " off"}`} {...(drag as React.HTMLAttributes<HTMLAnchorElement>)} draggable={drag.draggable}>
      <div className="space-card-top">
        {s.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.image.split("#")[0]} alt="" draggable={false} />
        ) : (
          <span className="space-mono" aria-hidden="true">{s.label.slice(0, 2)}</span>
        )}
        <span className="space-card-name">
          <b>{s.label}</b>
          <small className="tnum">
            {unit ? `${s.default_amount} room${s.default_amount === 1 ? "" : "s"} · ${qar(s.rate_premium)} each` : `${s.default_amount} m² · ${qar(s.rate_premium)}/m²`}
          </small>
        </span>
      </div>
      <div className="space-card-foot">
        <span className="prio" title={`Placement priority ${s.priority} of 5`} aria-label={`Placement priority ${s.priority} of 5`}>
          {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= s.priority ? "on" : ""} />)}
        </span>
        <span className="space-thumbs">
          {thumbs.slice(0, 4).map((t, i) =>
            t.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={t.image.split("#")[0]} alt={t.label} title={t.label} draggable={false} />
            ) : (
              <span key={i} title={t.label}>{t.label.slice(0, 1)}</span>
            )
          )}
          <em className="tnum">{count ? `${count} item${count === 1 ? "" : "s"}` : s.render === "contents" ? "empty" : "built in"}</em>
        </span>
      </div>
      {(s.pool || s.heat || s.forgotten || !s.active) && (
        <div className="space-tags">
          {s.pool && <span>POOL</span>}
          {s.heat && <span>HEAT</span>}
          {s.forgotten && <span className="amber">OFTEN FORGOTTEN</span>}
          {!s.active && <span className="amber">HIDDEN</span>}
        </div>
      )}
    </Link>
  );
}
