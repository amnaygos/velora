"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { mediaRegistry } from "@/content/mediaRegistry";
import { buildMediaRef } from "@/lib/media";
import { listUploads, measureImage, uploadImage } from "./uploadImage";

type Tab = "projects" | "uploads" | "films" | "studio";

const PROJECT_PREFIXES = ["pair-", "portfolio-", "detail-", "extra-"];

/**
 * Pick a photo for a case study: the site's own photography (already in
 * /public), anything uploaded before, or a new upload. Returns a media
 * reference (registry id or uploaded URL) through onPick.
 */
export default function MediaLibrary({
  open,
  allowVideo,
  onPick,
  onClose,
}: {
  open: boolean;
  allowVideo: boolean;
  onPick: (ref: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("projects");
  const [uploads, setUploads] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const site = useMemo(() => {
    const assets = Object.values(mediaRegistry).filter((a) => a.status === "ready" && (a.src || a.poster));
    return {
      projects: assets.filter((a) => a.type === "image" && PROJECT_PREFIXES.some((p) => a.id.startsWith(p))),
      films: assets.filter((a) => a.type === "video"),
      studio: assets.filter((a) => a.type === "image" && !PROJECT_PREFIXES.some((p) => a.id.startsWith(p))),
    };
  }, []);

  useEffect(() => {
    if (!open || uploads) return;
    listUploads().then(setUploads).catch(() => setUploads([]));
  }, [open, uploads]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function pickUpload(src: string) {
    setBusy(true);
    try {
      const size = await measureImage(src);
      onPick(buildMediaRef({ src, ...size, alt: "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read that photo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onPick(await uploadImage(file));
      setUploads(null); // refresh the list next time
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!open) return null;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "projects", label: "PROJECT PHOTOGRAPHY", count: site.projects.length },
    { id: "uploads", label: "UPLOADED", count: uploads?.length ?? 0 },
    ...(allowVideo ? [{ id: "films" as Tab, label: "FILMS", count: site.films.length }] : []),
    { id: "studio", label: "STUDIO IMAGERY", count: site.studio.length },
  ];

  return (
    <div className="lib-backdrop" onClick={onClose}>
      <div className="lib-modal" role="dialog" aria-modal="true" aria-label="Choose a photo" onClick={(e) => e.stopPropagation()}>
        <div className="lib-head">
          <div>
            <div className="eyebrow mb-16">PHOTO LIBRARY</div>
            <h2 style={{ fontSize: 18, fontWeight: 300, letterSpacing: "0.04em" }}>Choose a photo</h2>
          </div>
          <div className="flex items-center gap-12">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 size={13} className="spin" /> : <Upload size={13} strokeWidth={1.4} />} UPLOAD NEW
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
              <X size={15} strokeWidth={1.3} />
            </button>
          </div>
        </div>

        <div className="lib-tabs">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={`chip${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
              {t.label} · {t.count}
            </button>
          ))}
        </div>
        {error && <div className="login-error" style={{ margin: "0 28px 16px" }}>{error}</div>}

        <div className="lib-grid">
          {tab === "uploads" ? (
            uploads === null ? (
              <p className="dim tt-none">Loading…</p>
            ) : uploads.length === 0 ? (
              <p className="dim tt-none">Nothing uploaded yet. Use Upload new to add a photo from your computer.</p>
            ) : (
              uploads.map((src) => (
                <button key={src} type="button" className="lib-item" data-ref={src} onClick={() => pickUpload(src)} disabled={busy}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))
            )
          ) : (
            site[tab].map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="lib-item"
                data-ref={asset.id}
                title={asset.alt}
                onClick={() => onPick(asset.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.type === "video" ? asset.poster : asset.src} alt="" loading="lazy" />
                {asset.type === "video" && <span className="lib-badge">FILM</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
