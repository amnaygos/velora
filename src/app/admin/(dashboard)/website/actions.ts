"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { roleFromUser } from "@/lib/admin/rbac";
import { SITE_SETTINGS_TAG } from "@/lib/siteSettings";
import { TESTIMONIALS_TAG } from "@/lib/website";
import { normalizeWhatsAppNumber, WHATSAPP_MESSAGE_MAX } from "@/lib/whatsapp";
import type { ContactChannels, Figure, PortfolioStatus, StudioDetails } from "@/types/database";

export type ActionResult = { ok: boolean; error?: string; id?: string };

/** Everything on this page is manager-only (RLS enforces it too). */
async function assertManager(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Not signed in.";
  if (roleFromUser(user) !== "manager") return "Managers only.";
  return null;
}

// ---------------------------------------------------------------- Studio

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepts "@velora", "instagram.com/velora" or a full URL; returns a full https URL or null. */
function socialUrl(raw: string, host: "instagram.com" | "linkedin.com"): string | null | false {
  const value = raw.trim();
  if (!value) return null;
  if (host === "instagram.com" && /^@?[\w.]+$/.test(value)) return `https://www.instagram.com/${value.replace(/^@/, "")}`;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.endsWith(host)) return false;
    url.protocol = "https:";
    return url.toString();
  } catch {
    return false;
  }
}

/** Email, address, social links and the three headline figures. */
export async function updateStudioDetails(input: StudioDetails): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };

  const email = (input.contact_email ?? "").trim().toLowerCase();
  if (email && !EMAIL.test(email)) return { ok: false, error: "That email address doesn't look right." };

  const address = input.studio_address.map((l) => l.trim().toUpperCase()).filter(Boolean);
  if (address.length > 8) return { ok: false, error: "Keep the address to eight lines or fewer." };

  const instagram = socialUrl(input.instagram_url ?? "", "instagram.com");
  if (instagram === false) return { ok: false, error: "Use an instagram.com link or an @handle for Instagram." };
  const linkedin = socialUrl(input.linkedin_url ?? "", "linkedin.com");
  if (linkedin === false) return { ok: false, error: "Use a linkedin.com link for LinkedIn." };

  const figures: Figure[] = input.figures.map((f) => ({
    value: Math.max(0, Math.round(Number(f.value) || 0)),
    suffix: (f.suffix ?? "").trim().slice(0, 3),
    label: f.label.trim().toUpperCase(),
  }));
  if (figures.length !== 3 || figures.some((f) => !f.label || !f.value)) {
    return { ok: false, error: "Each of the three figures needs a number and a label." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({ contact_email: email || null, studio_address: address, instagram_url: instagram, linkedin_url: linkedin, figures })
    .eq("id", true);
  if (error) return { ok: false, error: error.message };

  updateTag(SITE_SETTINGS_TAG);
  revalidatePath("/admin/website");
  return { ok: true };
}

// ---------------------------------------------------------------- Testimonials

export type TestimonialInput = { quote: string; attribution: string; status: PortfolioStatus };

function cleanTestimonial(input: TestimonialInput) {
  const quote = input.quote
    .split(/\r?\n/)
    .map((l) => l.trim().toUpperCase())
    .filter(Boolean)
    .join("\n");
  return { quote, attribution: input.attribution.trim().toUpperCase(), status: input.status };
}

function expireTestimonials() {
  updateTag(TESTIMONIALS_TAG);
  revalidatePath("/admin/website");
}

export async function saveTestimonial(id: string | null, input: TestimonialInput): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };
  const row = cleanTestimonial(input);
  if (!row.quote) return { ok: false, error: "Write the quote." };
  if (!row.attribution) return { ok: false, error: "Say who said it, e.g. PRIVATE CLIENT — DOHA." };

  const supabase = await createClient();
  if (id) {
    const { error } = await supabase.from("testimonials").update(row).eq("id", id);
    if (error) return { ok: false, error: error.message };
    expireTestimonials();
    return { ok: true, id };
  }
  const { data: last } = await supabase.from("testimonials").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const { data, error } = await supabase
    .from("testimonials")
    .insert({ ...row, sort_order: (last?.[0]?.sort_order ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't add the quote." };
  expireTestimonials();
  return { ok: true, id: data.id };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  expireTestimonials();
  return { ok: true };
}

export async function reorderTestimonials(ids: string[]): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };
  const supabase = await createClient();
  const results = await Promise.all(ids.map((id, i) => supabase.from("testimonials").update({ sort_order: i + 1 }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  expireTestimonials();
  return { ok: true };
}

// ---------------------------------------------------------------- Subscribers

export async function removeSubscriber(id: string): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/website");
  return { ok: true };
}

// ---------------------------------------------------------------- Contact buttons

/**
 * Switch the public site's contact channels or edit the WhatsApp details.
 * Validates the merged result, so WhatsApp can never be live without a
 * number, then expires the cached settings so the public site updates on its
 * next request.
 */
export async function updateContactChannels(patch: Partial<ContactChannels>): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };

  const update: Partial<ContactChannels> = {};
  if (typeof patch.chatbot_enabled === "boolean") update.chatbot_enabled = patch.chatbot_enabled;
  if (typeof patch.whatsapp_enabled === "boolean") update.whatsapp_enabled = patch.whatsapp_enabled;

  if (patch.whatsapp_number !== undefined) {
    const raw = (patch.whatsapp_number ?? "").trim();
    const number = raw ? normalizeWhatsAppNumber(raw) : null;
    if (raw && !number) {
      return { ok: false, error: "Enter the full international number, starting with + and the country code." };
    }
    update.whatsapp_number = number;
  }

  if (patch.whatsapp_message !== undefined) {
    const message = (patch.whatsapp_message ?? "").trim();
    if (message.length > WHATSAPP_MESSAGE_MAX) {
      return { ok: false, error: `Keep the message under ${WHATSAPP_MESSAGE_MAX} characters.` };
    }
    update.whatsapp_message = message || null;
  }

  const admin = createAdminClient();

  const { data: current, error: readErr } = await admin
    .from("site_settings")
    .select("whatsapp_enabled, whatsapp_number")
    .single<Pick<ContactChannels, "whatsapp_enabled" | "whatsapp_number">>();
  if (readErr || !current) return { ok: false, error: readErr?.message ?? "Site settings not found." };

  const enabled = update.whatsapp_enabled ?? current.whatsapp_enabled;
  const number = update.whatsapp_number !== undefined ? update.whatsapp_number : current.whatsapp_number;
  if (enabled && !number) {
    return {
      ok: false,
      error: current.whatsapp_enabled
        ? "Switch WhatsApp off before removing its number."
        : "Save a WhatsApp number before switching it on.",
    };
  }

  const { error } = await admin.from("site_settings").update(update).eq("id", true);
  if (error) return { ok: false, error: error.message };

  updateTag(SITE_SETTINGS_TAG);
  revalidatePath("/admin/website");
  return { ok: true };
}
