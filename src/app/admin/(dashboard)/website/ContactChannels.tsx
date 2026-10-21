"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import { WhatsAppGlyph } from "@/components/contact/WhatsAppGlyph";
import {
  formatWhatsAppNumber,
  normalizeWhatsAppNumber,
  whatsAppHref,
  WHATSAPP_MESSAGE_MAX,
} from "@/lib/whatsapp";
import type { ContactChannels as Channels } from "@/types/database";
import { updateContactChannels } from "./actions";

function Switch({
  on,
  label,
  disabled,
  title,
  onChange,
}: {
  on: boolean;
  label: string;
  disabled?: boolean;
  title?: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={title}
      disabled={disabled}
      className="switch"
      onClick={() => onChange(!on)}
    />
  );
}

/**
 * The public site's contact channels: the AI concierge and the WhatsApp
 * button. Switches save the moment they're flipped; the WhatsApp details
 * save with their own button, since a number going live deserves a
 * deliberate step.
 */
export default function ContactChannels({
  channels,
  assistantConfigured,
}: {
  channels: Channels | null;
  assistantConfigured: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [chatOn, setChatOn] = useState(channels?.chatbot_enabled ?? false);
  const [waOn, setWaOn] = useState(channels?.whatsapp_enabled ?? false);
  const [saved, setSaved] = useState({
    number: channels?.whatsapp_number ?? null,
    message: channels?.whatsapp_message ?? null,
  });
  const [number, setNumber] = useState(saved.number ? formatWhatsAppNumber(saved.number) : "");
  const [message, setMessage] = useState(saved.message ?? "");
  const [justSaved, setJustSaved] = useState(false);

  if (!channels) {
    return (
      <div className="panel">
        <div className="panel-head">
          <h3>CONTACT CHANNELS</h3>
        </div>
        <div className="panel-pad">
          <p className="channel-warn" style={{ marginTop: 0 }}>
            The site_settings table is missing. Apply the latest Supabase migration to manage the AI
            concierge and WhatsApp from here.
          </p>
        </div>
      </div>
    );
  }

  const normalized = number.trim() ? normalizeWhatsAppNumber(number) : null;
  const numberInvalid = number.trim() !== "" && !normalized;
  const numberMissingWhileLive = waOn && number.trim() === "";
  const dirty = normalized !== saved.number || message.trim() !== (saved.message ?? "");

  function save(patch: Partial<Channels>, revert?: () => void, onSuccess?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await updateContactChannels(patch);
      if (!result.ok) {
        revert?.();
        setError(result.error ?? "Couldn't save that change.");
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  }

  function toggleChat(next: boolean) {
    setChatOn(next);
    save({ chatbot_enabled: next }, () => setChatOn(!next));
  }

  function toggleWhatsApp(next: boolean) {
    setWaOn(next);
    save({ whatsapp_enabled: next }, () => setWaOn(!next));
  }

  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    save({ whatsapp_number: number, whatsapp_message: message }, undefined, () => {
      setSaved({ number: normalized, message: message.trim() || null });
      if (normalized) setNumber(formatWhatsAppNumber(normalized));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2200);
    });
  }

  let numberHint = "Include the country code.";
  if (numberMissingWhileLive) numberHint = "Required while WhatsApp is live.";
  else if (numberInvalid) numberHint = "Start with + and the country code, e.g. +974 …";
  else if (normalized) numberHint = `Shows on the site as ${formatWhatsAppNumber(normalized)}`;

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>CONTACT CHANNELS</h3>
        <span className="label">ON THE PUBLIC SITE</span>
      </div>

      {error && (
        <div className="login-error" style={{ margin: "22px 28px 0" }}>
          {error}
        </div>
      )}

      {/* AI concierge */}
      <div className={`channel${chatOn ? " live" : ""}`}>
        <div className="channel-icon">
          <MessageSquareText size={14} strokeWidth={1.4} />
        </div>
        <div>
          <div className="channel-name">AI CONCIERGE</div>
          <p className="channel-desc">
            The &ldquo;Let&rsquo;s talk&rdquo; assistant. Answers visitors&rsquo; questions and saves
            leads straight to Enquiries.
          </p>
          {!assistantConfigured && (
            <p className="channel-warn">
              OPENAI_API_KEY isn&rsquo;t set on the server, so the assistant can&rsquo;t reply even when
              it&rsquo;s live.
            </p>
          )}
        </div>
        <div className="channel-toggle">
          <span className="channel-state">{chatOn ? "LIVE" : "OFF"}</span>
          <Switch on={chatOn} label="AI concierge on the public site" disabled={isPending} onChange={toggleChat} />
        </div>
      </div>

      {/* WhatsApp */}
      <div className={`channel${waOn ? " live" : ""}`}>
        <div className="channel-icon">
          <WhatsAppGlyph width={14} height={14} />
        </div>
        <div>
          <div className="channel-name">WHATSAPP</div>
          <p className="channel-desc">
            A button on every page that opens a WhatsApp chat with the studio.
          </p>
        </div>
        <div className="channel-toggle">
          <span className="channel-state">{waOn ? "LIVE" : "OFF"}</span>
          <Switch
            on={waOn}
            label="WhatsApp button on the public site"
            disabled={isPending || (!waOn && !saved.number)}
            title={!waOn && !saved.number ? "Save a number first" : undefined}
            onChange={toggleWhatsApp}
          />
        </div>

        <form className="channel-body" onSubmit={saveDetails}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="wa-number">NUMBER</label>
              <input
                id="wa-number"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                placeholder="+974 5555 1234"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                aria-invalid={numberInvalid || numberMissingWhileLive}
                aria-describedby="wa-number-hint"
              />
              <span
                id="wa-number-hint"
                className={`field-hint${numberInvalid || numberMissingWhileLive ? " warn" : ""}`}
              >
                {numberHint}
              </span>
            </div>
            <div className="field">
              <label htmlFor="wa-message">PREFILLED MESSAGE</label>
              <input
                id="wa-message"
                type="text"
                maxLength={WHATSAPP_MESSAGE_MAX}
                placeholder="Hello VELORA, I'd like to discuss a project."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-describedby="wa-message-hint"
              />
              <span id="wa-message-hint" className="field-hint">
                Optional. Visitors can edit it before sending.
              </span>
            </div>
          </div>

          <div className="between">
            {normalized ? (
              <a
                className="channel-link tt-none"
                href={whatsAppHref(normalized, message)}
                target="_blank"
                rel="noopener noreferrer"
                title="Open this chat in WhatsApp to check it"
              >
                wa.me/{normalized.slice(1)}
                <span>
                  TEST <ArrowUpRight size={11} strokeWidth={1.6} />
                </span>
              </a>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-16">
              {justSaved && <span className="channel-saved">SAVED</span>}
              <button
                type="submit"
                className="btn btn-outline btn-sm"
                disabled={!dirty || numberInvalid || numberMissingWhileLive || isPending}
              >
                {isPending && dirty ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
