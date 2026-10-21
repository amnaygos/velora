"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { formatDateLabel } from "@/lib/admin/format";
import type { ContactChannels as Channels, Figure, SiteSettings, StudioDetails, Subscriber, TestimonialRow } from "@/types/database";
import ContactChannels from "./ContactChannels";
import {
  deleteTestimonial,
  removeSubscriber,
  reorderTestimonials,
  saveTestimonial,
  updateStudioDetails,
  type TestimonialInput,
} from "./actions";

const EMPTY_FIGURES: Figure[] = [
  { value: 0, suffix: "+", label: "" },
  { value: 0, suffix: "+", label: "" },
  { value: 0, suffix: "+", label: "" },
];

function studioOf(settings: SiteSettings | null): StudioDetails {
  return {
    contact_email: settings?.contact_email ?? "",
    studio_address: settings?.studio_address ?? [],
    instagram_url: settings?.instagram_url ?? "",
    linkedin_url: settings?.linkedin_url ?? "",
    figures: settings?.figures?.length === 3 ? settings.figures : EMPTY_FIGURES,
  };
}

/** A small "saved / error" line under a panel's save button. */
function Status({ pending, error, saved }: { pending: boolean; error: string | null; saved: boolean }) {
  if (pending) return <span className="editor-state tt-none">Saving…</span>;
  if (error) return <span className="editor-state tt-none" style={{ color: "var(--amber)" }}>{error}</span>;
  if (saved) return <span className="editor-state tt-none">Saved — live on the site.</span>;
  return null;
}

export default function WebsiteClient({
  settings,
  channels,
  testimonials,
  subscribers,
  subscriberCount,
  assistantConfigured,
}: {
  settings: SiteSettings | null;
  channels: Channels | null;
  testimonials: TestimonialRow[];
  subscribers: Subscriber[];
  subscriberCount: number;
  assistantConfigured: boolean;
}) {
  // Studio details and figures save through the same action, so they share what was last saved.
  const [studio, setStudio] = useState<StudioDetails>(() => studioOf(settings));

  return (
    <div className="grid cols-main gap-24">
      <div className="stack gap-24">
        <ContactChannels channels={channels} assistantConfigured={assistantConfigured} />
        <StudioPanel studio={studio} onSaved={setStudio} />
        <TestimonialsPanel initial={testimonials} />
      </div>
      <div className="stack gap-24">
        <FiguresPanel studio={studio} onSaved={setStudio} />
        <SubscribersPanel subscribers={subscribers} count={subscriberCount} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Studio details

function StudioPanel({ studio, onSaved }: { studio: StudioDetails; onSaved: (s: StudioDetails) => void }) {
  const [email, setEmail] = useState(studio.contact_email ?? "");
  const [address, setAddress] = useState(studio.studio_address.join("\n"));
  const [instagram, setInstagram] = useState(studio.instagram_url ?? "");
  const [linkedin, setLinkedin] = useState(studio.linkedin_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const next: StudioDetails = {
    ...studio,
    contact_email: email,
    studio_address: address.split(/\r?\n/),
    instagram_url: instagram,
    linkedin_url: linkedin,
  };
  const dirty =
    email !== (studio.contact_email ?? "") ||
    address !== studio.studio_address.join("\n") ||
    instagram !== (studio.instagram_url ?? "") ||
    linkedin !== (studio.linkedin_url ?? "");

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateStudioDetails(next);
      if (!result.ok) return setError(result.error ?? "Couldn't save.");
      const lines = address.split(/\r?\n/).map((l) => l.trim().toUpperCase()).filter(Boolean);
      setAddress(lines.join("\n"));
      onSaved({ ...next, studio_address: lines });
      setSaved(true);
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>STUDIO</h3>
        <span className="dim tt-none" style={{ fontSize: 11 }}>Footer, menu, contact page and map</span>
      </div>
      <div className="panel-pad">
        <div className="field">
          <label>Contact email</label>
          <input type="email" className="tt-none" value={email} placeholder="hello@velora.qa" onChange={(e) => { setEmail(e.target.value); setSaved(false); }} />
          <p className="field-hint tt-none">Shown on the site and used for the discovery-call link.</p>
        </div>
        <div className="field">
          <label>Studio address</label>
          <textarea rows={5} value={address} onChange={(e) => { setAddress(e.target.value); setSaved(false); }} />
          <p className="field-hint tt-none">One line per line, as printed on the contact page. The map is centred on it.</p>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Instagram</label>
            <input type="text" className="tt-none" value={instagram} placeholder="@velora or instagram.com/velora" onChange={(e) => { setInstagram(e.target.value); setSaved(false); }} />
          </div>
          <div className="field">
            <label>LinkedIn</label>
            <input type="text" className="tt-none" value={linkedin} placeholder="linkedin.com/company/velora" onChange={(e) => { setLinkedin(e.target.value); setSaved(false); }} />
          </div>
        </div>
        <p className="field-hint tt-none mb-24" style={{ marginTop: -10 }}>
          Social links appear on the site only once they&apos;re filled in. WhatsApp follows the contact button settings.
        </p>
        <div className="flex items-center gap-16">
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!dirty || pending}>
            SAVE
          </button>
          <Status pending={pending} error={error} saved={saved && !dirty} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Figures

function FiguresPanel({ studio, onSaved }: { studio: StudioDetails; onSaved: (s: StudioDetails) => void }) {
  const [figures, setFigures] = useState<Figure[]>(studio.figures);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(figures) !== JSON.stringify(studio.figures);

  function update(index: number, patch: Partial<Figure>) {
    setFigures((f) => f.map((x, i) => (i === index ? { ...x, ...patch } : x)));
    setSaved(false);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateStudioDetails({ ...studio, figures });
      if (!result.ok) return setError(result.error ?? "Couldn't save.");
      onSaved({ ...studio, figures });
      setSaved(true);
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>HEADLINE FIGURES</h3>
      </div>
      <div className="panel-pad">
        <p className="dim tt-none mb-24" style={{ fontSize: 11 }}>
          The three numbers that count up on the home and About pages.
        </p>
        {figures.map((f, index) => (
          <div className="figure-row" key={index}>
            <input
              type="number"
              min={0}
              value={f.value || ""}
              placeholder="100"
              aria-label={`Figure ${index + 1} number`}
              onChange={(e) => update(index, { value: Number(e.target.value) })}
            />
            <input
              type="text"
              value={f.suffix}
              maxLength={3}
              placeholder="+"
              aria-label={`Figure ${index + 1} suffix`}
              onChange={(e) => update(index, { suffix: e.target.value })}
            />
            <input
              type="text"
              value={f.label}
              placeholder="PROJECTS DELIVERED"
              aria-label={`Figure ${index + 1} label`}
              onChange={(e) => update(index, { label: e.target.value.toUpperCase() })}
            />
          </div>
        ))}
        <div className="flex items-center gap-16 mt-16">
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!dirty || pending}>
            SAVE
          </button>
          <Status pending={pending} error={error} saved={saved && !dirty} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Testimonials

type Draft = TestimonialInput & { id: string | null; key: string; savedAs: TestimonialInput | null };

const toDraft = (t: TestimonialRow): Draft => {
  const input = { quote: t.quote, attribution: t.attribution, status: t.status };
  return { ...input, id: t.id, key: t.id, savedAs: input };
};

function TestimonialsPanel({ initial }: { initial: TestimonialRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Draft[]>(() => initial.map(toDraft));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const homeKey = rows.find((r) => r.id && r.savedAs?.status === "published")?.key;
  const patch = (key: string, p: Partial<Draft>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...p } : r)));
  const isDirty = (r: Draft) =>
    !r.savedAs || r.quote !== r.savedAs.quote || r.attribution !== r.savedAs.attribution || r.status !== r.savedAs.status;

  function save(row: Draft) {
    startTransition(async () => {
      const result = await saveTestimonial(row.id, { quote: row.quote, attribution: row.attribution, status: row.status });
      if (!result.ok) {
        setErrors((e) => ({ ...e, [row.key]: result.error ?? "Couldn't save." }));
        return;
      }
      setErrors((e) => Object.fromEntries(Object.entries(e).filter(([key]) => key !== row.key)));
      const quote = row.quote.split(/\r?\n/).map((l) => l.trim().toUpperCase()).filter(Boolean).join("\n");
      const attribution = row.attribution.trim().toUpperCase();
      patch(row.key, { id: result.id ?? row.id, quote, attribution, savedAs: { quote, attribution, status: row.status } });
      router.refresh();
    });
  }

  function remove(row: Draft) {
    if (!row.id) {
      setRows((rs) => rs.filter((r) => r.key !== row.key));
      return;
    }
    startTransition(async () => {
      const result = await deleteTestimonial(row.id!);
      if (!result.ok) {
        setErrors((e) => ({ ...e, [row.key]: result.error ?? "Couldn't delete." }));
        return;
      }
      setRows((rs) => rs.filter((r) => r.key !== row.key));
      setConfirming(null);
    });
  }

  function move(index: number, delta: number) {
    const next = [...rows];
    next.splice(index + delta, 0, next.splice(index, 1)[0]);
    setRows(next);
    const ids = next.map((r) => r.id).filter((id): id is string => Boolean(id));
    startTransition(async () => {
      const result = await reorderTestimonials(ids);
      if (!result.ok) setRows(rows);
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>TESTIMONIALS</h3>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setRows((rs) => [...rs, { id: null, key: crypto.randomUUID(), quote: "", attribution: "", status: "published", savedAs: null }])}
        >
          <Plus size={12} strokeWidth={1.4} /> ADD A QUOTE
        </button>
      </div>
      <div className="panel-pad">
        <p className="dim tt-none mb-24" style={{ fontSize: 11 }}>
          The first published quote runs on the home page. Each line break in a quote is a line break on the site.
        </p>
        {rows.length === 0 && <p className="dim tt-none">No quotes yet.</p>}
        <div className="stack gap-16">
          {rows.map((row, index) => (
            <div className={`quote-row${row.key === homeKey ? " home" : ""}`} key={row.key}>
              <div className="quote-tools">
                {row.key === homeKey && <span className="pill pill-olive">HOME PAGE</span>}
                {row.savedAs?.status === "draft" && <span className="pill pill-amber">HIDDEN</span>}
                <span style={{ flex: 1 }} />
                <button type="button" className="icon-btn" aria-label="Move up" disabled={index === 0 || !row.id || pending} onClick={() => move(index, -1)}>
                  <ArrowUp size={12} strokeWidth={1.4} />
                </button>
                <button type="button" className="icon-btn" aria-label="Move down" disabled={index === rows.length - 1 || !row.id || !rows[index + 1]?.id || pending} onClick={() => move(index, 1)}>
                  <ArrowDown size={12} strokeWidth={1.4} />
                </button>
                {confirming === row.key ? (
                  <>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => remove(row)} disabled={pending}>DELETE</button>
                    <button type="button" className="icon-btn" aria-label="Keep it" onClick={() => setConfirming(null)}><X size={12} strokeWidth={1.4} /></button>
                  </>
                ) : (
                  <button type="button" className="icon-btn" aria-label="Delete quote" onClick={() => (row.id ? setConfirming(row.key) : remove(row))}>
                    <Trash2 size={12} strokeWidth={1.4} />
                  </button>
                )}
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <textarea
                  rows={Math.max(2, row.quote.split("\n").length)}
                  value={row.quote}
                  placeholder={"“THEY DIDN’T DESIGN A GYM.\nTHEY DESIGNED THE REASON\nI WAKE UP AT 5:30.”"}
                  aria-label="Quote"
                  onChange={(e) => patch(row.key, { quote: e.target.value })}
                />
              </div>
              <div className="quote-foot">
                <div className="field" style={{ marginBottom: 0, flex: 1 }}>
                  <input
                    type="text"
                    value={row.attribution}
                    placeholder="PRIVATE CLIENT — DOHA"
                    aria-label="Who said it"
                    onChange={(e) => patch(row.key, { attribution: e.target.value })}
                  />
                </div>
                <label className="toggle-inline">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={row.status === "published"}
                    aria-label="Show on the site"
                    className="switch"
                    onClick={() => patch(row.key, { status: row.status === "published" ? "draft" : "published" })}
                  />
                  <span className="tt-none">On the site</span>
                </label>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => save(row)} disabled={!isDirty(row) || pending}>
                  SAVE
                </button>
              </div>
              {errors[row.key] && <p className="field-hint tt-none" style={{ color: "var(--amber)" }}>{errors[row.key]}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Subscribers

function SubscribersPanel({ subscribers, count }: { subscribers: Subscriber[]; count: number }) {
  const router = useRouter();
  const [list, setList] = useState(subscribers);
  const [pending, startTransition] = useTransition();

  function remove(id: string) {
    startTransition(async () => {
      const result = await removeSubscriber(id);
      if (result.ok) {
        setList((l) => l.filter((s) => s.id !== id));
        router.refresh();
      }
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>NEWSLETTER · {count}</h3>
        <span className="dim tt-none" style={{ fontSize: 11 }}>The Velora Edit</span>
      </div>
      {list.length === 0 ? (
        <div className="panel-pad">
          <p className="dim tt-none" style={{ fontSize: 11 }}>No subscribers yet. Sign-ups from The Velora Standard page land here.</p>
        </div>
      ) : (
        <ul className="sub-list">
          {list.map((s) => (
            <li key={s.id}>
              <span>
                <b className="tt-none">{s.email}</b>
                <small>{[s.role, formatDateLabel(s.created_at)].filter(Boolean).join(" · ")}</small>
              </span>
              <button type="button" className="icon-btn" aria-label={`Remove ${s.email}`} title="Remove" disabled={pending} onClick={() => remove(s.id)}>
                <Trash2 size={12} strokeWidth={1.4} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
