import type { ReactNode } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { RouteTransitionProvider } from "@/components/layout/RouteTransitionProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ContactDock } from "@/components/contact/ContactDock";
import { StudioProvider, type Studio } from "@/components/providers/StudioProvider";
import { getSiteSettings } from "@/lib/siteSettings";
import { getStudioDetails } from "@/lib/website";
import { formatWhatsAppNumber, whatsAppHref } from "@/lib/whatsapp";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";

// Pages stay static, but re-render at least every minute so a change to the
// contact channels in /admin/settings lands even if the instant tag
// invalidation is missed (e.g. Supabase was unreachable at build time).
export const revalidate = 60;

// The public marketing site. All of the immersive chrome (smooth scroll,
// route transitions, custom cursor, grain, structured data) is scoped here so
// it only ever wraps public pages — never the admin at /admin.
export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, details] = await Promise.all([getSiteSettings(), getStudioDetails()]);
  const whatsapp =
    settings.whatsapp_enabled && settings.whatsapp_number
      ? {
          href: whatsAppHref(settings.whatsapp_number, settings.whatsapp_message),
          display: formatWhatsAppNumber(settings.whatsapp_number),
        }
      : null;

  // Social links appear only once they are set in /admin/website.
  const studio: Studio = {
    email: details.contact_email,
    address: details.studio_address,
    figures: details.figures,
    socials: [
      details.instagram_url ? { label: "INSTAGRAM", href: details.instagram_url } : null,
      details.linkedin_url ? { label: "LINKEDIN", href: details.linkedin_url } : null,
      whatsapp ? { label: "WHATSAPP", href: whatsapp.href } : null,
    ].filter((link): link is { label: string; href: string } => link !== null),
  };

  return (
    <StudioProvider value={studio}>
    <MotionProvider>
      <SmoothScrollProvider>
        <RouteTransitionProvider>
          <a href="#main" className="velora-skip-link">
            Skip to content
          </a>
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
          <CustomCursor />
          <ContactDock chat={settings.chatbot_enabled} whatsapp={whatsapp} />
          <div className="velora-grain" aria-hidden="true" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([organizationJsonLd(studio), websiteJsonLd()]),
            }}
          />
        </RouteTransitionProvider>
      </SmoothScrollProvider>
    </MotionProvider>
    </StudioProvider>
  );
}
