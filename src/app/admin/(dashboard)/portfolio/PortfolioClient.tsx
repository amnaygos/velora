"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GripVertical, Plus } from "lucide-react";
import { mediaThumb } from "@/components/admin/media/MediaField";
import type { PortfolioItem } from "@/types/database";
import { reorderPortfolio, setPortfolioStatus } from "./actions";

type Filter = "all" | "published" | "draft" | "featured";

/**
 * The portfolio exactly as the site shows it: same order, same covers.
 * Drag a card (or use its arrows) to change the order on the site; open a
 * card to edit the case study.
 */
export default function PortfolioClient({ items: initial }: { items: PortfolioItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const orderAtDragStart = useRef<string[]>([]);

  // Fresh server data (after a save elsewhere) replaces the local order.
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setItems(initial);
  }

  const counts = {
    all: items.length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
    featured: items.filter((i) => i.featured).length,
  };
  const visible = items.filter((i) =>
    filter === "all" ? true : filter === "featured" ? i.featured : i.status === filter
  );
  const canReorder = filter === "all";

  function persistOrder(next: PortfolioItem[], before: string[]) {
    const ids = next.map((i) => i.id);
    if (ids.join() === before.join()) return;
    startTransition(async () => {
      const result = await reorderPortfolio(ids);
      if (!result.ok) {
        setError(result.error ?? "Couldn't save the new order.");
        setItems((current) => before.map((id) => current.find((i) => i.id === id)!));
      } else router.refresh();
    });
  }

  function move(id: string, delta: number) {
    const before = items.map((i) => i.id);
    const from = items.findIndex((i) => i.id === id);
    const to = from + delta;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setItems(next);
    persistOrder(next, before);
  }

  function dragOver(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setItems((current) => {
      const next = [...current];
      const from = next.findIndex((i) => i.id === dragId);
      const to = next.findIndex((i) => i.id === targetId);
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }

  function toggleStatus(item: PortfolioItem) {
    const status = item.status === "published" ? "draft" : "published";
    setError(null);
    startTransition(async () => {
      const result = await setPortfolioStatus(item.id, status);
      if (!result.ok) setError(result.error ?? "Couldn't change that.");
      else {
        setItems((current) => current.map((i) => (i.id === item.id ? { ...i, status } : i)));
        router.refresh();
      }
    });
  }

  const chip = (id: Filter, label: string) => (
    <button type="button" className={`chip${filter === id ? " on" : ""}`} onClick={() => setFilter(id)}>
      {label} · {counts[id]}
    </button>
  );

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — CONTENT</div>
          <h1>Portfolio</h1>
        </div>
        <div className="topbar-actions">
          <a className="btn btn-outline btn-sm" href="/portfolio" target="_blank" rel="noreferrer">
            VIEW ON SITE
          </a>
          <Link href="/admin/portfolio/new" className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={1.3} />
            NEW CASE STUDY
          </Link>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <div className="filters">
            {chip("all", "ALL")}
            {chip("published", "PUBLISHED")}
            {chip("draft", "DRAFT")}
            {chip("featured", "ON THE HOME PAGE")}
          </div>
          <p className="dim tt-none" style={{ fontSize: 11 }}>
            {pending ? "Saving…" : canReorder ? "Drag to set the order on the site." : "Show all to change the order."}
          </p>
        </div>
        {error && <div className="login-error mb-24">{error}</div>}

        {items.length === 0 ? (
          <div className="panel panel-pad empty-state">
            <p className="tt-none">No case studies yet. Published ones appear on the site&apos;s portfolio and home page.</p>
            <Link href="/admin/portfolio/new" className="btn btn-primary btn-sm mt-16">
              <Plus size={13} strokeWidth={1.3} /> NEW CASE STUDY
            </Link>
          </div>
        ) : (
          <div className="pf-grid">
            {visible.map((item) => {
              const index = items.findIndex((i) => i.id === item.id);
              const cover = mediaThumb(item.hero_media || item.after_media);
              return (
                <div
                  key={item.id}
                  className={`pf-card${dragId === item.id ? " dragging" : ""}`}
                  draggable={canReorder}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    orderAtDragStart.current = items.map((i) => i.id);
                    setDragId(item.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    dragOver(item.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    persistOrder(items, orderAtDragStart.current);
                  }}
                  onClick={() => router.push(`/admin/portfolio/${item.id}`)}
                >
                  <div className="pf-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {cover ? <img src={cover} alt="" draggable={false} /> : <div className="media-empty" style={{ height: "100%" }}><span>No cover photo</span></div>}
                    <span className="status flex gap-8">
                      <span className={`pill ${item.status === "published" ? "pill-solid" : "pill-amber"}`}>
                        {item.status === "published" ? "PUBLISHED" : "DRAFT"}
                      </span>
                      {item.featured && <span className="pill pill-olive">HOME PAGE</span>}
                    </span>
                    <span className="pf-order tnum">{String(index + 1).padStart(2, "0")}</span>
                    <div className="ba" onClick={(e) => e.stopPropagation()}>
                      {canReorder && (
                        <>
                          <button type="button" className="icon-btn pf-tool" title="Move earlier" aria-label={`Move ${item.name} earlier`} disabled={index === 0 || pending} onClick={() => move(item.id, -1)}>
                            <ArrowLeft size={13} strokeWidth={1.4} />
                          </button>
                          <button type="button" className="icon-btn pf-tool" title="Move later" aria-label={`Move ${item.name} later`} disabled={index === items.length - 1 || pending} onClick={() => move(item.id, 1)}>
                            <ArrowRight size={13} strokeWidth={1.4} />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="icon-btn pf-tool"
                        title={item.status === "published" ? "Hide from the site" : "Publish"}
                        aria-label={item.status === "published" ? `Hide ${item.name} from the site` : `Publish ${item.name}`}
                        disabled={pending}
                        onClick={() => toggleStatus(item)}
                      >
                        {item.status === "published" ? <EyeOff size={13} strokeWidth={1.4} /> : <Eye size={13} strokeWidth={1.4} />}
                      </button>
                    </div>
                  </div>
                  <div className="pf-body">
                    <div className="cat">{item.category}</div>
                    <div className="nm">
                      {canReorder && <GripVertical size={12} strokeWidth={1.4} className="pf-grip" aria-hidden="true" />}
                      {item.name}
                    </div>
                    <div className="meta">
                      <span>{item.location ?? ""}</span>
                      <span>{item.year ?? ""}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link href="/admin/portfolio/new" className="pf-add">
              <Plus size={26} strokeWidth={1.1} />
              <span>NEW CASE STUDY</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
