import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { DiscoveryCall } from "@/components/sections/contact/DiscoveryCall";
import { StudioMap } from "@/components/sections/contact/StudioMap";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Begin your journey. Enquiries go directly to VELORA's principals — Safwa Building, Barwa Commercial Avenue, Doha. Doha · London.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <DiscoveryCall />
      <StudioMap />
    </>
  );
}
