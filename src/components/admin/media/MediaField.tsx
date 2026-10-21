"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { buildMediaRef, getMediaOrNull, parseMediaRef } from "@/lib/media";
import MediaLibrary from "./MediaLibrary";
import { uploadImage } from "./uploadImage";

/** Thumbnail source for any media reference (photo, film poster, or upload). */
export function mediaThumb(ref: string | null | undefined): string | null {
  if (!ref) return null;
  const asset = getMediaOrNull(ref);
  if (!asset) return null;
  return (asset.type === "video" ? asset.poster : asset.src) ?? null;
}

/**
 * One photo slot in the case-study editor: shows the photo, lets the manager
 * upload a new one or choose from the library, and — for uploads — describe
 * it for screen readers and search engines. Dropping a file on it uploads it.
 */
export default function MediaField({
  label,
  hint,
  value,
  onChange,
  ratio = "4 / 3",
  allowVideo = false,
}: {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (ref: string | null) => void;
  ratio?: string;
  allowVideo?: boolean;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const thumb = mediaThumb(value);
  const upload = value ? parseMediaRef(value) : null;
  const siteAsset = value && !upload ? getMediaOrNull(value) : null;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="media-field">
      <div className="label mb-16">{label}</div>
      <div
        className={`mf-frame${dragOver ? " drag" : ""}`}
        style={{ aspectRatio: ratio }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" />
        ) : (
          <button type="button" className="mf-empty" onClick={() => setLibraryOpen(true)}>
            <ImagePlus size={22} strokeWidth={1.1} />
            <span>ADD PHOTO</span>
          </button>
        )}
        {busy && (
          <div className="mf-busy">
            <Loader2 size={18} className="spin" />
          </div>
        )}
      </div>

      <div className="mf-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
          <Upload size={12} strokeWidth={1.4} /> UPLOAD
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setLibraryOpen(true)} disabled={busy}>
          <RefreshCw size={12} strokeWidth={1.4} /> {value ? "REPLACE" : "LIBRARY"}
        </button>
        {value && (
          <button type="button" className="icon-btn" title="Remove photo" aria-label={`Remove ${label.toLowerCase()}`} onClick={() => onChange(null)} disabled={busy}>
            <Trash2 size={13} strokeWidth={1.4} />
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {upload && (
        <div className="field mf-alt">
          <input
            type="text"
            value={upload.alt}
            placeholder="Describe the photo (for screen readers and search)"
            onChange={(e) => onChange(buildMediaRef({ ...upload, alt: e.target.value }))}
          />
        </div>
      )}
      {siteAsset && <p className="field-hint tt-none mf-note">{siteAsset.alt || "Site photography"}</p>}
      {hint && !value && <p className="field-hint tt-none mf-note">{hint}</p>}
      {error && <p className="field-hint tt-none" style={{ color: "var(--amber)" }}>{error}</p>}

      <MediaLibrary
        open={libraryOpen}
        allowVideo={allowVideo}
        onClose={() => setLibraryOpen(false)}
        onPick={(ref) => {
          onChange(ref);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}
