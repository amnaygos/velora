"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, ImagePlus, Plus, Trash2, X } from "lucide-react";
import MediaField, { mediaThumb } from "@/components/admin/media/MediaField";
import MediaLibrary from "@/components/admin/media/MediaLibrary";
import { PROJECT_CATEGORIES } from "@/types/project";
import type { PortfolioItem } from "@/types/database";
import { deletePortfolioItem, savePortfolioItem, type PortfolioInput } from "./actions";

const MAX_FIGURES = 4;

function toInput(item: PortfolioItem | null): PortfolioInput {
  return {
    name: item?.name ?? "",
    category: item?.category ?? PROJECT_CATEGORIES[0],
    location: item?.location ?? "",
    year: item?.year ?? String(new Date().getFullYear()),
    area: item?.area ?? "",
    delivery: item?.delivery ?? "",
    services: item?.services ?? [],
    description: item?.description ?? "",
    brief: item?.brief ?? "",
    response: item?.response ?? "",
    outcome: item?.outcome ?? "",
    metrics: item?.metrics ?? [],
    hero_media: item?.hero_media ?? null,
    gallery: item?.gallery ?? [],
    before_media: item?.before_media ?? null,
    after_media: item?.after_media ?? null,
    before_condition: item?.before_condition ?? "",
    featured: item?.featured ?? false,
    status: item?.status ?? "draft",
  };
}

/**
 * The case-study editor. Everything here is what the public case study shows:
 * the cover, the before & after, the story, the gallery, and the details. The
 * site updates as soon as it is saved.
 */
export default function PortfolioEditor({
  item,
  serviceOptions,
}: {
  item: PortfolioItem | null;
  serviceOptions: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<PortfolioInput>(() => toInput(item));
  const [saved, setSaved] = useState<PortfolioInput>(() => toInput(item));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [galleryLibrary, setGalleryLibrary] = useState(false);
  const [newService, setNewService] = useState("");
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const set = <K extends keyof PortfolioInput>(key: K, value: PortfolioInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setNotice(null);
  };

  const save = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const result = await savePortfolioItem(item?.id ?? null, form);
      if (!result.ok) {
        setError(result.error ?? "Couldn't save.");
        return;
      }
      setSaved(form);
      setNotice(form.status === "published" ? "Saved — live on the site." : "Saved as a draft.");
      if (!item) router.replace(`/admin/portfolio/${result.id}`);
      else router.refresh();
    });
  }, [form, item, router]);

  // ⌘S / Ctrl+S saves; leaving with unsaved changes asks first.
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
    if (!item) return;
    startTransition(async () => {
      const result = await deletePortfolioItem(item.id);
      if (!result.ok) {
        setError(result.error ?? "Couldn't delete.");
        return;
      }
      setSaved(form); // nothing left to lose
      router.push("/admin/portfolio");
    });
  }

  const allServices = Array.from(new Set([...serviceOptions, ...form.services]));
  function toggleService(service: string) {
    set("services", form.services.includes(service) ? form.services.filter((s) => s !== service) : [...form.services, service]);
  }
  function addService() {
    const s = newService.trim().toUpperCase();
    if (s && !form.services.includes(s)) set("services", [...form.services, s]);
    setNewService("");
  }

  function moveGallery(index: number, delta: number) {
    const next = [...form.gallery];
    const [moved] = next.splice(index, 1);
    next.splice(index + delta, 0, moved);
    set("gallery", next);
  }

  const live = item?.status === "published" && saved.status === "published";
  const field = (key: "name" | "location" | "year" | "area" | "delivery", label: string, placeholder: string, required = false) => (
    <div className="field">
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
      <input type="text" value={form[key] ?? ""} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} />
    </div>
  );
  const story = (key: "description" | "brief" | "response" | "outcome", label: string, hint: string, rows = 4) => (
    <div className="field">
      <label>{label}</label>
      <textarea className="tt-none" rows={rows} value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} />
      <p className="field-hint tt-none">{hint}</p>
    </div>
  );

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">
            <Link href="/admin/portfolio" style={{ color: "var(--olive)" }}>
              PORTFOLIO
            </Link>{" "}
            — {item ? form.category.toUpperCase() : "NEW CASE STUDY"}
          </div>
          <h1>{form.name.trim() || "Untitled case study"}</h1>
        </div>
        <div className="topbar-actions">
          <span className="editor-state tt-none" aria-live="polite">
            {pending ? "Saving…" : error ? "" : dirty ? "Unsaved changes" : notice ?? ""}
          </span>
          {live && (
            <a className="btn btn-outline btn-sm" href={`/portfolio/${item!.slug}`} target="_blank" rel="noreferrer">
              VIEW ON SITE <ArrowUpRight size={13} strokeWidth={1.4} />
            </a>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={pending || (!dirty && Boolean(item))}>
            {form.status === "published" && saved.status !== "published" ? "SAVE & PUBLISH" : "SAVE"}
          </button>
        </div>
      </header>

      <div className="content">
        {error && <div className="login-error mb-24">{error}</div>}

        <div className="grid cols-main gap-24 editor">
          {/* ---------------- The case study ---------------- */}
          <div className="stack gap-24">
            <div className="panel panel-pad">
              <MediaField
                label="COVER"
                ratio="16 / 9"
                value={form.hero_media}
                onChange={(v) => set("hero_media", v)}
                hint="Shown on the portfolio card and at the top of the case study. If empty, the after photo is used."
              />
            </div>

            <div className="panel panel-pad">
              <div className="label mb-16">BEFORE & AFTER</div>
              <p className="dim tt-none mb-24" style={{ fontSize: 11 }}>
                The same room from the same camera position. Visitors drag a slider between the two.
              </p>
              <div className="field-row">
                <MediaField label="BEFORE" value={form.before_media} onChange={(v) => set("before_media", v)} />
                <MediaField label="AFTER" value={form.after_media} onChange={(v) => set("after_media", v)} />
              </div>
              <div className="field mt-24" style={{ marginBottom: 0 }}>
                <label>The room as found</label>
                <textarea
                  className="tt-none"
                  rows={2}
                  value={form.before_condition ?? ""}
                  placeholder="A bare concrete shell: unfinished ceiling, exposed services…"
                  onChange={(e) => set("before_condition", e.target.value)}
                />
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="label mb-24">THE STORY</div>
              {story("description", "Summary", "One or two sentences. Shown in search results and in the preview at the end of the case study before this one.", 3)}
              {story("brief", "The brief", "What the client needed, and what the space was.")}
              {story("response", "Our response", "What VELORA designed and built.")}
              {story("outcome", "The outcome", "What it delivered.", 3)}
            </div>

            <div className="panel panel-pad">
              <div className="between mb-24">
                <div className="label" style={{ margin: 0 }}>GALLERY · {form.gallery.length}</div>
                <span className="dim tt-none" style={{ fontSize: 11 }}>Photos and films below the story, in this order.</span>
              </div>
              <div className="gallery-grid">
                {form.gallery.map((ref, index) => (
                  <div className="gallery-tile" key={`${ref}-${index}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {mediaThumb(ref) ? <img src={mediaThumb(ref)!} alt="" /> : <div className="media-empty" />}
                    <div className="gallery-tools">
                      <button type="button" className="icon-btn" title="Move earlier" aria-label="Move earlier" disabled={index === 0} onClick={() => moveGallery(index, -1)}>
                        <ArrowLeft size={12} strokeWidth={1.4} />
                      </button>
                      <button type="button" className="icon-btn" title="Move later" aria-label="Move later" disabled={index === form.gallery.length - 1} onClick={() => moveGallery(index, 1)}>
                        <ArrowRight size={12} strokeWidth={1.4} />
                      </button>
                      <button type="button" className="icon-btn" title="Remove" aria-label="Remove from gallery" onClick={() => set("gallery", form.gallery.filter((_, i) => i !== index))}>
                        <Trash2 size={12} strokeWidth={1.4} />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="gallery-add" onClick={() => setGalleryLibrary(true)}>
                  <ImagePlus size={20} strokeWidth={1.1} />
                  <span>ADD</span>
                </button>
              </div>
              <MediaLibrary
                open={galleryLibrary}
                allowVideo
                onClose={() => setGalleryLibrary(false)}
                onPick={(ref) => {
                  set("gallery", [...form.gallery, ref]);
                  setGalleryLibrary(false);
                }}
              />
            </div>
          </div>

          {/* ---------------- Publishing & details ---------------- */}
          <div className="stack gap-24">
            <div className="panel panel-pad">
              <div className="label mb-16">ON THE SITE</div>
              <div className="seg w-full mb-24" role="group" aria-label="Visibility">
                <button type="button" className={form.status === "published" ? "active" : ""} style={{ flex: 1 }} onClick={() => set("status", "published")}>
                  PUBLISHED
                </button>
                <button type="button" className={form.status === "draft" ? "active" : ""} style={{ flex: 1 }} onClick={() => set("status", "draft")}>
                  DRAFT
                </button>
              </div>
              <label className="toggle-row">
                <span>
                  <b>Feature on the home page</b>
                  <small className="tt-none">Featured case studies run in Selected Work, as a before & after when they have one.</small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured}
                  aria-label="Feature on the home page"
                  className="switch"
                  onClick={() => set("featured", !form.featured)}
                />
              </label>
              {item && (
                <p className="field-hint tt-none mt-16">
                  Web address: <span className="slug">/portfolio/{item.slug}</span>
                </p>
              )}
            </div>

            <div className="panel panel-pad">
              <div className="label mb-24">DETAILS</div>
              {field("name", "Project name", "Grand Training Hall", true)}
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-row">
                {field("location", "Location", "West Bay, Doha")}
                {field("year", "Year", "2026")}
              </div>
              <div className="field-row">
                {field("area", "Area", "420 SQM")}
                {field("delivery", "Delivery", "Delivered in five months")}
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="label mb-16">SERVICES</div>
              <div className="filters mb-16" style={{ flexWrap: "wrap" }}>
                {allServices.map((s) => (
                  <button key={s} type="button" className={`chip${form.services.includes(s) ? " on" : ""}`} aria-pressed={form.services.includes(s)} onClick={() => toggleService(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  value={newService}
                  placeholder="Add another service, then Enter"
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addService();
                    }
                  }}
                />
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="between mb-16">
                <div className="label" style={{ margin: 0 }}>KEY FIGURES</div>
                {form.metrics.length < MAX_FIGURES && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("metrics", [...form.metrics, { label: "", value: "" }])}>
                    <Plus size={12} strokeWidth={1.4} /> ADD
                  </button>
                )}
              </div>
              {form.metrics.length === 0 && <p className="dim tt-none" style={{ fontSize: 11 }}>Up to four numbers shown beside the story, e.g. Area · 420 SQM.</p>}
              {form.metrics.map((m, index) => (
                <div className="metric-row" key={index}>
                  <input
                    type="text"
                    value={m.label}
                    placeholder="LABEL"
                    aria-label="Figure label"
                    onChange={(e) => set("metrics", form.metrics.map((x, i) => (i === index ? { ...x, label: e.target.value.toUpperCase() } : x)))}
                  />
                  <input
                    type="text"
                    value={m.value}
                    placeholder="VALUE"
                    aria-label="Figure value"
                    onChange={(e) => set("metrics", form.metrics.map((x, i) => (i === index ? { ...x, value: e.target.value.toUpperCase() } : x)))}
                  />
                  <button type="button" className="icon-btn" aria-label="Remove figure" onClick={() => set("metrics", form.metrics.filter((_, i) => i !== index))}>
                    <X size={12} strokeWidth={1.4} />
                  </button>
                </div>
              ))}
            </div>

            {item && (
              <div className="panel panel-pad">
                <div className="label mb-16">DELETE</div>
                <p className="dim tt-none mb-16" style={{ fontSize: 11 }}>
                  Removes the case study from the site and the admin. Uploaded photos stay in the library.
                </p>
                {confirmDelete ? (
                  <div className="flex gap-8">
                    <button type="button" className="btn btn-primary btn-sm" onClick={remove} disabled={pending}>
                      CONFIRM DELETE
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(false)}>
                      KEEP IT
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={12} strokeWidth={1.4} /> DELETE CASE STUDY
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
