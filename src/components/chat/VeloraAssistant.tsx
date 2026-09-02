"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowUp } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const GREETING =
  "Welcome to VELORA. I can tell you about our work, or help you begin a project — what are you planning?";

const SUGGESTIONS = ["What does VELORA design?", "I'm planning a project", "Tell me about your standard"];

/** Width of the desktop drawer; the edge tab slides out by the same amount. */
const DRAWER_WIDTH = "420px";

const ease = "cubic-bezier(0.22,1,0.36,1)";

function Pulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping bg-olive opacity-60" />
      <span className="relative inline-flex h-2 w-2 bg-olive" />
    </span>
  );
}

/**
 * The studio's AI front desk.
 *
 * Launcher: on large screens a vertical tab docked to the right edge of the
 * viewport. It lives inside the page gutter (content stops 48px short of the
 * edge), so it never covers a line of text. Below lg the gutter is too narrow
 * for that, so it becomes a compact corner square that tucks away while the
 * visitor scrolls down — the same rule the header follows.
 *
 * Panel: a full-height drawer from the right edge on large screens, a
 * full-screen sheet on small ones.
 */
export function VeloraAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const leadIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { direction, atTop } = useScrollDirection();

  const started = messages.length > 1;
  const tucked = direction === "down" && !atTop && !open;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || sending) return;

    const next: Message[] = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the canned greeting; thread the lead id so the assistant edits
        // the same enquiry row across the conversation.
        body: JSON.stringify({ messages: next.slice(1), leadId: leadIdRef.current }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages((m) => [...m, { role: "assistant", content: data.content }]);
        if (data.leadId) leadIdRef.current = data.leadId;
        if (data.leadSaved) setSavedNote(true);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.error ?? "Apologies — something went wrong. Reach us at hello@velora.qa." },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach the studio just now. Please try again shortly." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const launcherLabel = open ? "Close the VELORA chat" : "Open the VELORA chat — let's talk";

  return (
    <>
      {/* ── Launcher · lg+: edge tab in the right-hand gutter ── */}
      <button
        type="button"
        aria-label={launcherLabel}
        aria-expanded={open}
        aria-controls="velora-chat"
        onClick={() => setOpen((v) => !v)}
        className="group fixed top-1/2 z-[270] hidden -translate-y-1/2 flex-col items-center gap-4 border border-r-0 border-white/15 bg-carbon/85 px-3 py-5 backdrop-blur-md transition-[right,border-color] duration-500 hover:border-olive/70 lg:flex"
        style={{ right: open ? DRAWER_WIDTH : 0, transitionTimingFunction: ease }}
      >
        {open ? <X size={14} strokeWidth={1.4} className="text-white/80" /> : <Pulse />}
        <span
          className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/80 transition-colors group-hover:text-olive"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {open ? "Close" : "Let's talk"}
        </span>
      </button>

      {/* ── Launcher · below lg: compact corner square that tucks away on scroll ── */}
      <button
        type="button"
        aria-label={launcherLabel}
        aria-expanded={open}
        aria-controls="velora-chat"
        tabIndex={tucked || open ? -1 : undefined}
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 z-[270] flex h-12 w-12 flex-col items-center justify-center gap-1.5 border border-white/15 bg-carbon/85 backdrop-blur-md transition-all duration-500 lg:hidden",
          (tucked || open) && "pointer-events-none translate-y-20 opacity-0",
        )}
        style={{ transitionTimingFunction: ease }}
      >
        <Pulse />
        <span className="text-[7px] font-medium uppercase tracking-[0.22em] text-white/80">Talk</span>
      </button>

      {/* ── Panel · sheet on small screens, right-hand drawer on large ── */}
      <div
        id="velora-chat"
        role="dialog"
        aria-label="VELORA — let's talk"
        inert={!open}
        className={cn(
          "fixed inset-0 z-[270] flex flex-col bg-carbon transition-transform duration-500",
          "lg:left-auto lg:w-[var(--drawer)] lg:border-l lg:border-white/12 lg:shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.8)]",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        style={{ transitionTimingFunction: ease, ["--drawer" as string]: DRAWER_WIDTH }}
      >
        {/* olive hairline */}
        <div className="h-px w-full shrink-0 bg-gradient-to-r from-olive/60 via-olive/20 to-transparent" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-6 py-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-olive">VELORA</p>
            <p className="mt-2 text-[15px] font-light uppercase tracking-[0.14em] text-white">
              Let&apos;s talk
            </p>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-white/40">
              <span className="h-1.5 w-1.5 bg-olive" />
              Online
            </span>
            <button
              type="button"
              aria-label="Close the VELORA chat"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center border border-white/12 text-white/70 transition-colors duration-300 hover:border-olive/60 hover:text-white"
            >
              <X size={14} strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <div className="mx-6 h-px shrink-0 bg-white/8" />

        {/* Messages — its own scroll region, kept out of Lenis's hands */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-6"
        >
          {messages.map((m, i) =>
            m.role === "assistant" ? (
              <div key={i} className="max-w-[92%] border-l border-olive/40 pl-4">
                <p className="text-[13px] font-light leading-[1.7] text-white/85">{m.content}</p>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] bg-white/[0.06] px-4 py-3 text-right text-[13px] font-light leading-[1.6] text-white">
                  {m.content}
                </p>
              </div>
            ),
          )}

          {sending && (
            <div className="max-w-[92%] border-l border-olive/40 pl-4">
              <div className="flex items-center gap-1.5 py-1">
                <span className="h-1 w-1 animate-pulse bg-olive/70" />
                <span className="h-1 w-1 animate-pulse bg-olive/70 [animation-delay:160ms]" />
                <span className="h-1 w-1 animate-pulse bg-olive/70 [animation-delay:320ms]" />
              </div>
            </div>
          )}

          {/* Suggestion chips (only before the conversation starts) */}
          {!started && !sending && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="border border-white/12 px-3 py-2 text-[10px] font-light tracking-[0.04em] text-white/60 transition-colors duration-300 hover:border-olive/60 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {savedNote && (
            <p className="flex items-center justify-center gap-3 pt-1 text-[8px] uppercase tracking-[0.28em] text-olive">
              <span className="h-px w-6 bg-olive/40" />
              Shared with our team
              <span className="h-px w-6 bg-olive/40" />
            </p>
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
          <div className="flex items-end gap-3 border border-white/12 bg-white/[0.02] px-4 py-3 transition-colors duration-300 focus-within:border-olive/60">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask, or share your project…"
              className="max-h-28 flex-1 resize-none bg-transparent text-[13px] font-light leading-[1.5] text-white placeholder:text-white/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => send(input)}
              disabled={!input.trim() || sending}
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center bg-olive text-carbon transition-opacity duration-300 hover:opacity-90 disabled:opacity-25"
            >
              <ArrowUp size={16} strokeWidth={2} />
            </button>
          </div>
          <p className="mt-3 text-center text-[8px] uppercase tracking-[0.24em] text-white/25">
            AI assistant · your enquiry reaches our principals
          </p>
        </div>
      </div>
    </>
  );
}
