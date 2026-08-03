import type { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesTimeline } from "@/components/sections/services/ServicesTimeline";
import { ServicesCTA } from "@/components/sections/services/ServicesCTA";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Consultation, architectural design, development, hospitality wellness, equipment, operations, supervision, and business consulting — one partner from first question to day 1,001.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesTimeline />
      <ServicesCTA />
    </>
  );
}
