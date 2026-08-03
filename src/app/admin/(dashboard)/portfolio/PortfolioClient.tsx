"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X, Pencil } from "lucide-react";
import type { PortfolioItem, PortfolioStatus } from "@/types/database";
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "./actions";

const CATEGORY_OPTIONS = ["Gyms & Fitness", "Spa & Wellness", "Hospitality"];

interface FormState {
  name: string;
  category: string;
  location: string;
  year: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  status: PortfolioStatus;
}

const emptyForm: FormState = {
  name: "",
  category: CATEGORY_OPTIONS[0],
  location: "",
  year: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  status: "published",
};

function itemToForm(item: PortfolioItem): FormState {
  return {
    name: item.name,
    category: item.category,
    location: item.location ?? "",
    year: item.year ?? "",
    beforeImageUrl: item.before_image_url ?? "",
    afterImageUrl: item.after_image_url ?? "",
    status: item.status,
  };
}

export default function PortfolioClient({ items }: { items: PortfolioItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set());
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const publishedCount = items.filter((i) => i.status === "published").length;
  const draftCount = items.filter((i) => i.status === "draft").length;
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort();

  const filtered = items.filter(
    (i) =>
      (activeStatuses.size === 0 || activeStatuses.has(i.status)) &&
      (activeCategories.size === 0 || activeCategories.has(i.category))
  );

  function toggleStatus(status: string) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function toggleCategory(category: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function openCreate() {
    setMode("create");
    setEditing(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  }

  function openEdit(item: PortfolioItem) {
    setMode("edit");
    setEditing(item);
    setForm(itemToForm(item));
    setDrawerOpen(true);
  }

  // Deep-link: the detail page's EDIT button lands here with ?edit=<id>,
  // which opens that item's editor directly.
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId) return;
    const item = items.find((i) => i.id === editId);
    if (item) openEdit(item);
    // Strip the param so a refresh doesn't reopen it.
    router.replace("/admin/portfolio");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("category", form.category);
    fd.set("location", form.location);
    fd.set("year", form.year);
    fd.set("before_image_url", form.beforeImageUrl);
    fd.set("after_image_url", form.afterImageUrl);
    fd.set("status", form.status);

    setSaving(true);
    if (mode === "edit" && editing) {
      await updatePortfolioItem(editing.id, fd);
    } else {
      await createPortfolioItem(fd);
    }
    setSaving(false);
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleRemove() {
    if (!editing) return;
    setSaving(true);
    await deletePortfolioItem(editing.id);
    setSaving(false);
    setDrawerOpen(false);
    router.refresh();
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — CONTENT</div>
          <h1>Portfolio</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={13} strokeWidth={1.3} />
            ADD PROJECT
          </button>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <div className="filters">
            <button
              type="button"
              className={`chip${activeStatuses.has("published") ? " on" : ""}`}
              onClick={() => toggleStatus("published")}
            >
              PUBLISHED · {publishedCount}
            </button>
            <button
              type="button"
              className={`chip${activeStatuses.has("draft") ? " on" : ""}`}
              onClick={() => toggleStatus("draft")}
            >
              DRAFT · {draftCount}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip${activeCategories.has(cat) ? " on" : ""}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="dim" style={{ fontSize: 8, letterSpacing: "0.2em" }}>
            {filtered.length} OF {items.length} · CLICK A CARD TO VIEW
          </p>
        </div>

        <div className="pf-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="pf-card"
              onClick={() => router.push(`/admin/portfolio/${item.id}`)}
            >
              <div className="pf-thumb">
                {item.after_image_url && <img src={item.after_image_url} alt="" />}
                <span className="status">
                  <span className={`pill ${item.status === "published" ? "pill-solid" : "pill-amber"}`}>
                    {item.status === "published" ? "PUBLISHED" : "DRAFT"}
                  </span>
                </span>
                <div className="ba">
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 30, height: 30, background: "rgba(28,28,28,0.75)" }}
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(item);
                    }}
                  >
                    <Pencil size={13} strokeWidth={1.4} />
                  </button>
                </div>
              </div>
              <div className="pf-body">
                <div className="cat">{item.category}</div>
                <div className="nm">{item.name}</div>
                <div className="meta">
                  <span>{item.location ?? ""}</span>
                  <span>{item.year ?? ""}</span>
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="pf-add" onClick={openCreate}>
            <Plus size={26} strokeWidth={1.1} />
            <span>ADD PROJECT</span>
          </button>
        </div>
      </div>

      <div className={`overlay${drawerOpen ? " open" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="drawer-head">
            <div>
              <div className="eyebrow mb-16">PORTFOLIO ENTRY</div>
              <h2 style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>
                {form.name || "New Portfolio Entry"}
              </h2>
            </div>
            <button type="button" className="icon-btn" onClick={closeDrawer}>
              <X size={15} strokeWidth={1.3} />
            </button>
          </div>

          <div className="drawer-body">
            <div className="field-row" style={{ marginBottom: 32 }}>
              <div>
                <div className="label mb-16">BEFORE</div>
                <div className="pf-thumb" style={{ aspectRatio: "4/3", border: "1px solid var(--w10)", marginBottom: 10 }}>
                  {form.beforeImageUrl && <img src={form.beforeImageUrl} alt="" />}
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <input
                    type="text"
                    value={form.beforeImageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, beforeImageUrl: e.target.value }))}
                    placeholder="/Portfolio/example-B.png"
                  />
                </div>
              </div>
              <div>
                <div className="label mb-16">AFTER</div>
                <div className="pf-thumb" style={{ aspectRatio: "4/3", border: "1px solid var(--w10)", marginBottom: 10 }}>
                  {form.afterImageUrl && <img src={form.afterImageUrl} alt="" />}
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <input
                    type="text"
                    value={form.afterImageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, afterImageUrl: e.target.value }))}
                    placeholder="/Portfolio/example-A.png"
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <label>
                Project Name <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Project name"
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {form.category && !CATEGORY_OPTIONS.includes(form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Doha, Qatar"
                />
              </div>
              <div className="field">
                <label>Year</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="2025"
                />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label mb-16">VISIBILITY</div>
              <div className="choice-grid">
                <button
                  type="button"
                  className={`choice${form.status === "published" ? " sel" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, status: "published" }))}
                >
                  <span className="box" />
                  Published
                </button>
                <button
                  type="button"
                  className={`choice${form.status === "draft" ? " sel" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, status: "draft" }))}
                >
                  <span className="box" />
                  Draft
                </button>
              </div>
            </div>
          </div>

          <div className="drawer-foot">
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: "center" }} disabled={saving}>
              {saving ? "SAVING…" : form.status === "published" ? "SAVE & PUBLISH" : "SAVE AS DRAFT"}
            </button>
            {mode === "edit" && (
              <button type="button" className="btn btn-outline" onClick={handleRemove} disabled={saving}>
                REMOVE
              </button>
            )}
          </div>
        </form>
      </aside>
    </>
  );
}
