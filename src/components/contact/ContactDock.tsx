"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { DRAWER_EASE, DRAWER_WIDTH, VeloraAssistant } from "@/components/chat/VeloraAssistant";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { PRELOADER_DONE_EVENT } from "@/components/sections/home/Preloader";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export type WhatsAppContact = { href: string; display: string };

function Pulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping bg-olive opacity-60" />
      <span className="relative inline-flex h-2 w-2 bg-olive" />
    </span>
  );
}

/** Olive hairline that draws in along the tab's outer edge on hover. */
function EdgeAccent() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 -left-px w-px origin-center scale-y-0 bg-olive transition-transform duration-500 group-hover:scale-y-100 group-focus-visible:scale-y-100"
      style={{ transitionTimingFunction: DRAWER_EASE }}
    />
  );
}

function EdgeLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/80 transition-colors duration-300 group-hover:text-olive"
      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
    >
      {children}
    </span>
  );
}

/**
 * The site's ways to reach the studio. Which channels appear is switched in
 * /admin/settings (the site_settings row), so this renders nothing when all
 * of them are off.
 *
 * Chat, lg+: a vertical tab docked to the right edge, inside the page gutter
 * (content stops 48px short of the edge), so it never covers a line of text.
 * Below lg the gutter is too narrow, so it becomes a compact corner square.
 *
 * WhatsApp: its own green button in the bottom-right corner at every size.
 *
 * Below lg the corner tucks away while the visitor scrolls down — the same
 * rule the header follows.
 */
export function ContactDock({ chat, whatsapp }: { chat: boolean; whatsapp: WhatsAppContact | null }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [arrived, setArrived] = useState(false);
  const { direction, atTop } = useScrollDirection();
  const closeChat = useCallback(() => setChatOpen(false), []);

  // Arrive once the page has settled — after the home preloader has lifted,
  // where there is one — so the entrance is seen rather than played behind it.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arrive = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setArrived(true), 1100);
    };
    const preloading =
      document.querySelector("[data-preloader]") !== null &&
      document.documentElement.dataset.veloraReady !== "true";
    if (!preloading) {
      arrive();
      return () => clearTimeout(timer);
    }
    window.addEventListener(PRELOADER_DONE_EVENT, arrive, { once: true });
    // Safety: never leave the dock hidden if the event is missed.
    const safety = setTimeout(arrive, 6000);
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, arrive);
      clearTimeout(timer);
      clearTimeout(safety);
    };
  }, []);

  if (!chat && !whatsapp) return null;

  const tucked = direction === "down" && !atTop && !chatOpen;
  const chatLabel = chatOpen ? "Close the VELORA chat" : "Open the VELORA chat — let's talk";

  return (
    <>
      {/* ── Chat · lg+: edge tab in the right-hand gutter ── */}
      {chat && (
        <button
          type="button"
          aria-label={chatLabel}
          aria-expanded={chatOpen}
          aria-controls="velora-chat"
          onClick={() => setChatOpen((v) => !v)}
          className={cn(
            "group fixed top-1/2 z-[270] hidden -translate-y-1/2 flex-col items-center gap-4 border border-r-0 border-white/15 bg-carbon/85 px-3 py-5 backdrop-blur-md transition-[right,translate,opacity] duration-700 focus-visible:outline-none lg:flex",
            !arrived && "translate-x-full opacity-0",
          )}
          style={{ right: chatOpen ? DRAWER_WIDTH : 0, transitionTimingFunction: DRAWER_EASE }}
        >
          <EdgeAccent />
          {chatOpen ? <X size={14} strokeWidth={1.4} className="text-white/80" /> : <Pulse />}
          <EdgeLabel>{chatOpen ? "Close" : "Let's talk"}</EdgeLabel>
        </button>
      )}

      {/* ── Corner: WhatsApp at every size, chat square below lg ── */}
      <div
        className={cn(
          "fixed bottom-4 right-4 z-[270] flex flex-col items-end gap-3 transition-[translate,opacity] duration-500 lg:bottom-8 lg:right-8",
          chatOpen && "pointer-events-none opacity-0",
          tucked && "max-lg:pointer-events-none max-lg:translate-y-24 max-lg:opacity-0",
        )}
        style={{ transitionTimingFunction: DRAWER_EASE }}
      >
        {whatsapp && <WhatsAppButton whatsapp={whatsapp} arrived={arrived} />}
        {chat && (
          <button
            type="button"
            aria-label={chatLabel}
            aria-expanded={chatOpen}
            aria-controls="velora-chat"
            tabIndex={tucked || chatOpen ? -1 : undefined}
            onClick={() => setChatOpen(true)}
            className={cn(
              "flex h-12 w-12 flex-col items-center justify-center gap-1.5 border border-white/15 bg-carbon/85 backdrop-blur-md transition-[translate,opacity] duration-500 lg:hidden",
              !arrived && "translate-y-4 opacity-0",
            )}
            style={{ transitionTimingFunction: DRAWER_EASE }}
          >
            <Pulse />
            <span className="text-[7px] font-medium uppercase tracking-[0.22em] text-white/80">Talk</span>
          </button>
        )}
      </div>

      {chat && <VeloraAssistant open={chatOpen} onClose={closeChat} whatsapp={whatsapp} />}
    </>
  );
}
