"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Welcome to VELORA. How can we help you design your ideal wellness space?",
};

export default function VeloraChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [busy, setBusy]         = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 380);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok || !res.body) throw new Error();

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let acc       = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologise — something went wrong. Please try again or reach us at hello@velora.qa." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden"
            style={{
              width: 360,
              maxWidth: "calc(100vw - 48px)",
              height: 520,
              background: "#1C1C1C",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.75)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-[14px] flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="block w-[5px] h-[5px] bg-olive"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <div>
                  <p className="text-[9px] tracking-[0.35em] text-white/75">VELORA ASSISTANT</p>
                  <p className="text-[8px] tracking-[0.18em] text-white/25 mt-[2px]">ONLINE · AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/25 hover:text-white/70 transition-colors duration-300"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" ? (
                    <div className="max-w-[88%]">
                      {msg.content === "" && busy ? (
                        <div className="flex gap-[5px] pt-1">
                          {[0, 1, 2].map((j) => (
                            <motion.span
                              key={j}
                              className="block w-[4px] h-[4px] bg-olive/50"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.1, repeat: Infinity, delay: j * 0.18 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] font-light leading-[1.9] tracking-[0.01em] text-white/60">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      className="max-w-[88%] px-3 py-2"
                      style={{ background: "rgba(255,255,255,0.05)", borderLeft: "2px solid rgba(145,146,141,0.4)" }}
                    >
                      <p className="text-[12px] font-light leading-[1.9] tracking-[0.01em] text-white/85">
                        {msg.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={busy}
                placeholder="Ask about your project..."
                className="flex-1 min-w-0 bg-transparent text-[11px] tracking-[0.04em] text-white placeholder:text-white/18 focus:outline-none disabled:opacity-40"
              />
              <button
                onClick={send}
                disabled={!input.trim() || busy}
                className="flex-shrink-0 transition-opacity duration-300 disabled:opacity-20 hover:opacity-70"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#91928D" strokeWidth="1.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#91928D" stroke="none" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={
          !open
            ? { boxShadow: ["0 0 0 0px rgba(145,146,141,0.35)", "0 0 0 10px rgba(145,146,141,0)", "0 0 0 0px rgba(145,146,141,0)"] }
            : { boxShadow: "none" }
        }
        transition={!open ? { duration: 2.4, repeat: Infinity, ease: "easeOut" } : { duration: 0.2 }}
        className="w-12 h-12 flex items-center justify-center transition-colors duration-400"
        style={{
          background: open ? "#91928D" : "#1C1C1C",
          border: "1px solid rgba(145,146,141,0.38)",
        }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="x"
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#91928D" strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
