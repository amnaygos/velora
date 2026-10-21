import { createClient } from "@/lib/supabase/server";
import type { ContactChannels, SiteSettings, Subscriber, TestimonialRow } from "@/types/database";
import WebsiteClient from "./WebsiteClient";

export const dynamic = "force-dynamic";

/** Everything the public site shows that isn't a case study. */
export default async function WebsitePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: testimonials }, { data: subscribers, count }] = await Promise.all([
    supabase.from("site_settings").select("*").maybeSingle<SiteSettings>(),
    supabase.from("testimonials").select("*").order("sort_order", { ascending: true }).returns<TestimonialRow[]>(),
    supabase
      .from("subscribers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(200)
      .returns<Subscriber[]>(),
  ]);

  const channels: ContactChannels | null = settings
    ? {
        chatbot_enabled: settings.chatbot_enabled,
        whatsapp_enabled: settings.whatsapp_enabled,
        whatsapp_number: settings.whatsapp_number,
        whatsapp_message: settings.whatsapp_message,
      }
    : null;

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — CONTENT</div>
          <h1>Website</h1>
        </div>
        <div className="topbar-actions">
          <a className="btn btn-outline btn-sm" href="/" target="_blank" rel="noreferrer">
            VIEW SITE
          </a>
        </div>
      </header>

      <div className="content">
        <WebsiteClient
          settings={settings ?? null}
          channels={channels}
          testimonials={testimonials ?? []}
          subscribers={subscribers ?? []}
          subscriberCount={count ?? 0}
          assistantConfigured={Boolean(process.env.OPENAI_API_KEY)}
        />
      </div>
    </>
  );
}
