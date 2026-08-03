"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Loader2,
  ImageOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_BYTES,
  PHASE_LABEL,
  PHASE_ORDER,
  PROJECT_MEDIA_BUCKET,
  mediaUrl,
} from "@/lib/admin/media";
import {
  addProjectMedia,
  deleteProjectMedia,
  reorderMedia,
  setCoverMedia,
  updateMediaDetails,
} from "./media-actions";
import type { MediaPhase, ProjectMedia } from "@/types/database";

type Filter = "all" | MediaPhase;

export default function ProjectMediaGallery({
  projectId,
  media,
}: {
  projectId: string;
  media: ProjectMedia[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState<Filter>("all");
  const [uploadPhase, setUploadPhase] = useState<MediaPhase>("progress");
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? media : media.filter((m) => m.phase === filter)),
    [media, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: media.length };
    PHASE_ORDER.forEach((p) => (c[p] = media.filter((m) => m.phase === p).length));
    return c;
  }, [media]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const list = Array.from(files);

      const rejected = list.filter(
        (f) => !ACCEPTED_IMAGE_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES
      );
      if (rejected.length) {
        setError(
          `Skipped ${rejected.length} file(s) — images only (JPEG, PNG, WebP, AVIF), max 10MB each.`
        );
      }

      const accepted = list.filter(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type) && f.size <= MAX_FILE_BYTES
      );
      if (!accepted.length) return;

      setUploading(accepted.length);
      const supabase = createClient();

      for (const file of accepted) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${projectId}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from(PROJECT_MEDIA_BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });

        if (upErr) {
          setError(`Upload failed: ${upErr.message}`);
          setUploading(0);
          return;
        }
        await addProjectMedia(projectId, path, uploadPhase);
        setUploading((n) => n - 1);
      }

      setUploading(0);
      router.refresh();
    },
    [projectId, uploadPhase, router]
  );

  const act = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const busy = uploading > 0 || isPending;

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>PHOTOS</h3>
        <div className="flex items-center gap-12">
          <select
            className="media-phase-select"
            value={uploadPhase}
            onChange={(e) => setUploadPhase(e.target.value as MediaPhase)}
            title="Phase for new uploads"
            disabled={busy}
          >
            {PHASE_ORDER.map((p) => (
              <option key={p} value={p}>
                UPLOAD AS: {PHASE_LABEL[p]}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
          >
            {uploading > 0 ? (
              <>
                <Loader2 size={13} strokeWidth={1.4} className="spin" /> UPLOADING {uploading}…
              </>
            ) : (
              <>
                <Upload size={13} strokeWidth={1.4} /> UPLOAD
              </>
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="panel-pad">
        {/* Phase filters */}
        <div className="toolbar" style={{ marginBottom: 20 }}>
          <div className="filters">
            <button
              className={`chip${filter === "all" ? " on" : ""}`}
              onClick={() => setFilter("all")}
            >
              ALL · {counts.all}
            </button>
            {PHASE_ORDER.map((p) => (
              <button
                key={p}
                className={`chip${filter === p ? " on" : ""}`}
                onClick={() => setFilter(p)}
              >
                {PHASE_LABEL[p]} · {counts[p]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "var(--amber)",
              fontSize: 10,
              letterSpacing: "0.1em",
              marginBottom: 16,
              textTransform: "none",
            }}
          >
            {error}
          </p>
        )}

        {/* Dropzone */}
        <div
          className={`media-drop${dragOver ? " over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
          }}
          onClick={() => !busy && fileInput.current?.click()}
        >
          <Upload size={18} strokeWidth={1.2} />
          <span>
            DROP IMAGES HERE — TAGGED AS {PHASE_LABEL[uploadPhase]}
          </span>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="media-empty">
            <ImageOff size={22} strokeWidth={1.2} />
            <span>
              {media.length === 0
                ? "No photos yet"
                : `No ${PHASE_LABEL[filter as MediaPhase]?.toLowerCase()} photos`}
            </span>
          </div>
        ) : (
          <div className="media-grid">
            {visible.map((m, i) => {
              const idxInAll = media.findIndex((x) => x.id === m.id);
              return (
                <figure className="media-card" key={m.id}>
                  <div className="media-thumb" onClick={() => setLightbox(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl(m.storage_path)} alt={m.caption ?? ""} loading="lazy" />
                    <span className={`media-tag ${m.phase}`}>{PHASE_LABEL[m.phase]}</span>
                    {m.is_cover && (
                      <span className="media-cover-badge">
                        <Star size={9} strokeWidth={1.6} fill="currentColor" /> COVER
                      </span>
                    )}
                  </div>

                  <figcaption>
                    {editing === m.id ? (
                      <form
                        className="media-edit"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          const caption = String(fd.get("caption") || "");
                          const phase = String(fd.get("phase") || m.phase) as MediaPhase;
                          setEditing(null);
                          act(() => updateMediaDetails(projectId, m.id, caption, phase));
                        }}
                      >
                        <input
                          name="caption"
                          defaultValue={m.caption ?? ""}
                          placeholder="Caption…"
                          autoFocus
                        />
                        <select name="phase" defaultValue={m.phase}>
                          {PHASE_ORDER.map((p) => (
                            <option key={p} value={p}>
                              {PHASE_LABEL[p]}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-8">
                          <button type="submit" className="btn btn-primary btn-sm">
                            SAVE
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditing(null)}
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="media-caption">{m.caption || "Untitled"}</p>
                        <div className="media-actions">
                          <button
                            title="Move left"
                            disabled={busy || idxInAll === 0}
                            onClick={() => act(() => reorderMedia(projectId, m.id, "left"))}
                          >
                            <ChevronLeft size={13} strokeWidth={1.4} />
                          </button>
                          <button
                            title="Move right"
                            disabled={busy || idxInAll === media.length - 1}
                            onClick={() => act(() => reorderMedia(projectId, m.id, "right"))}
                          >
                            <ChevronRight size={13} strokeWidth={1.4} />
                          </button>
                          <button
                            title={m.is_cover ? "Already the cover" : "Set as cover"}
                            className={m.is_cover ? "on" : ""}
                            disabled={busy || m.is_cover}
                            onClick={() => act(() => setCoverMedia(projectId, m.id))}
                          >
                            <Star
                              size={13}
                              strokeWidth={1.4}
                              fill={m.is_cover ? "currentColor" : "none"}
                            />
                          </button>
                          <button title="Edit caption / phase" onClick={() => setEditing(m.id)}>
                            <Pencil size={13} strokeWidth={1.4} />
                          </button>
                          <button
                            title="Delete"
                            className="danger"
                            disabled={busy}
                            onClick={() => act(() => deleteProjectMedia(projectId, m.id))}
                          >
                            <Trash2 size={13} strokeWidth={1.4} />
                          </button>
                        </div>
                      </>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && visible[lightbox] && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)} title="Close">
            <X size={18} strokeWidth={1.4} />
          </button>
          {lightbox > 0 && (
            <button
              className="lb-nav lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox - 1);
              }}
            >
              <ChevronLeft size={22} strokeWidth={1.2} />
            </button>
          )}
          {lightbox < visible.length - 1 && (
            <button
              className="lb-nav lb-next"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox + 1);
              }}
            >
              <ChevronRight size={22} strokeWidth={1.2} />
            </button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(visible[lightbox].storage_path)}
              alt={visible[lightbox].caption ?? ""}
            />
            <figcaption>
              <span className={`media-tag ${visible[lightbox].phase}`}>
                {PHASE_LABEL[visible[lightbox].phase]}
              </span>
              <span className="lb-caption">{visible[lightbox].caption || "Untitled"}</span>
              <span className="lb-count">
                {lightbox + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
