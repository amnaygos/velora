import type { ReactNode } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { RouteTransitionProvider } from "@/components/layout/RouteTransitionProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { VeloraAssistant } from "@/components/chat/VeloraAssistant";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";

// The public marketing site. All of the immersive chrome (smooth scroll,
// route transitions, custom cursor, grain, structured data) is scoped here so
// it only ever wraps public pages — never the admin at /admin.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
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
          <VeloraAssistant />
          <div className="velora-grain" aria-hidden="true" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
            }}
          />
        </RouteTransitionProvider>
      </SmoothScrollProvider>
    </MotionProvider>
  );
}
