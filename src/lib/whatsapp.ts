/**
 * WhatsApp click-to-chat helpers, shared by the public contact dock and the
 * admin settings preview.
 */

export const WHATSAPP_MESSAGE_MAX = 300;

/**
 * Normalises what a manager types ("+974 5555 1234", "00974-5555-1234") into
 * E.164 ("+97455551234"). Returns null unless it's a full international
 * number — wa.me can't route a number without its country code.
 */
export function normalizeWhatsAppNumber(raw: string): string | null {
  const value = raw.trim();
  if (!/^(\+|00)/.test(value) || /[^\d\s()+.-]/.test(value)) return null;
  const digits = value.replace(/^00/, "").replace(/\D/g, "");
  // E.164 caps a number at 15 digits; 8 is a safe floor for code + subscriber.
  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}

/** Display form: Qatar and UK numbers grouped the local way, others as E.164. */
export function formatWhatsAppNumber(e164: string): string {
  const d = e164.replace(/\D/g, "");
  if (d.startsWith("974") && d.length === 11) return `+974 ${d.slice(3, 7)} ${d.slice(7)}`;
  if (d.startsWith("44") && d.length === 12) return `+44 ${d.slice(2, 6)} ${d.slice(6)}`;
  return `+${d}`;
}

export function whatsAppHref(e164: string, message?: string | null): string {
  const base = `https://wa.me/${e164.replace(/\D/g, "")}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
