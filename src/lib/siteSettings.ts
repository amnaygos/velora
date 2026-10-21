import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { ContactChannels } from "@/types/database";

/** Tag on the cached read; settings actions expire it so changes go live at once. */
export const SITE_SETTINGS_TAG = "site-settings";

/** Fail closed: if Supabase can't be reached, every optional channel stays off. */
const FALLBACK: ContactChannels = {
  chatbot_enabled: false,
  whatsapp_enabled: false,
  whatsapp_number: null,
  whatsapp_message: null,
};

const readSiteSettings = unstable_cache(
  async (): Promise<ContactChannels> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) throw new Error("Supabase is not configured");

    // Cookie-less anon client: the row is public-readable, and a cached scope
    // can't touch cookies() anyway.
    const supabase = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase
      .from("site_settings")
      .select("chatbot_enabled, whatsapp_enabled, whatsapp_number, whatsapp_message")
      .single();
    // Throw rather than return the fallback, so a failed read is never cached.
    if (error || !data) throw new Error(error?.message ?? "site_settings row missing");
    return data as ContactChannels;
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_TAG], revalidate: 60 }
);

/**
 * The public site's contact-channel switches. Server-only and cached; the
 * public layout and /api/chat both read through here.
 */
export async function getSiteSettings(): Promise<ContactChannels> {
  try {
    return await readSiteSettings();
  } catch {
    return FALLBACK;
  }
}
