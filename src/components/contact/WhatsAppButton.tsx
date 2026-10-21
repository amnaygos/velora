"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { WhatsAppContact } from "@/components/contact/ContactDock";
import { WhatsAppGlyph } from "@/components/contact/WhatsAppGlyph";
import { cn } from "@/lib/utils";

const GREETED_KEY = "velora-whatsapp-greeted";
/** Spring with a little overshoot, so the button lands rather than fades. */
const POP = "cubic-bezier(0.34,1.56,0.64,1)";
const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * WhatsApp's green button, in its own round brand shape.
 *
 * Once the dock has arrived it pops in, sends out two rings, and a message
 * bubble slides out of it inviting the visitor to get in touch. The bubble
 * shows once per visit and hides itself after a few seconds; after that it
 * returns only as a label while the button is hovered or focused.
 */
export function WhatsAppButton({ whatsapp, arrived }: { whatsapp: WhatsAppContact; arrived: boolean }) {
  const [greeting, setGreeting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!arrived) return;
    try {
      if (sessionStorage.getItem(GREETED_KEY) === "true") return;
    } catch {
      // Storage blocked: greet anyway.
    }
    const show = setTimeout(() => {
      setGreeting(true);
      try {
        sessionStorage.setItem(GREETED_KEY, "true");
      } catch {}
    }, 900);
    const hide = setTimeout(() => setGreeting(false), 9500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [arrived]);

  const bubble = arrived && !dismissed && (greeting || hovered);

  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setDismissed(false);
      }}
    >
      {/* ── Message bubble ── */}
      <div
        inert={!bubble}
        className={cn(
          "absolute bottom-1 right-full mr-4 w-[15.5rem] max-w-[calc(100vw-6.5rem)] origin-bottom-right bg-white text-carbon shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-500",
          bubble ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-2 scale-90 opacity-0",
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="block py-4 pl-5 pr-10"
        >
          <span className="block text-[8px] font-medium uppercase tracking-[0.35em] text-carbon/45">VELORA</span>
          <span className="mt-2 block text-[13px] font-medium leading-snug">Contact us on WhatsApp</span>
          <span className="mt-1 block text-[11px] leading-snug text-carbon/60">Message the studio directly.</span>
        </a>
        <button
          type="button"
          aria-label="Hide message"
          onClick={() => {
            setGreeting(false);
            setDismissed(true);
          }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center text-carbon/40 transition-colors duration-300 hover:text-carbon"
        >
          <X size={13} strokeWidth={1.6} />
        </button>
        {/* tail, pointing at the button */}
        <span aria-hidden="true" className="absolute -right-1.5 bottom-5 h-3 w-3 rotate-45 bg-white" />
      </div>

      {/* ── Button ── */}
      <a
        href={whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Contact us on WhatsApp, ${whatsapp.display}`}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn(
          "velora-round relative flex h-14 w-14 items-center justify-center bg-[#25D366] text-white shadow-[0_14px_32px_-10px_rgba(37,211,102,0.65)] transition-[transform,opacity,background-color,box-shadow] duration-700 hover:bg-[#1FBE5B] hover:shadow-[0_18px_40px_-10px_rgba(37,211,102,0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80 active:scale-95",
          arrived ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-50 opacity-0",
        )}
        style={{ transitionTimingFunction: POP }}
      >
        {arrived && (
          <>
            <span
              aria-hidden="true"
              className="velora-round pointer-events-none absolute inset-0 border-2 border-[#25D366] opacity-0"
              style={{ animation: "velora-whatsapp-ring 1.6s ease-out 0.5s 2" }}
            />
            <span
              aria-hidden="true"
              className="velora-round pointer-events-none absolute inset-0 border border-[#25D366] opacity-0"
              style={{ animation: "velora-whatsapp-ring 1.6s ease-out 0.9s 2" }}
            />
          </>
        )}
        <WhatsAppGlyph className="relative h-7 w-7" />
      </a>
    </div>
  );
}
