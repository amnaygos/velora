import type { Metadata } from "next";
import { ConsultancyHero } from "@/components/sections/consultancy/ConsultancyHero";
import { ConsultancyOffer } from "@/components/sections/consultancy/ConsultancyOffer";
import { ConsultancyProcess } from "@/components/sections/consultancy/ConsultancyProcess";
import { ConsultancyStatement } from "@/components/sections/consultancy/ConsultancyStatement";
import { ConsultancyCTA } from "@/components/sections/consultancy/ConsultancyCTA";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Business Consultancy",
  description:
    "VELORA business consultancy — operational audits, environment reviews, strategic roadmaps, and long-term advisory for established wellness operators across Qatar and the United Kingdom.",
  path: "/consultancy",
});

export default function ConsultancyPage() {
  return (
    <>
      <ConsultancyHero />
      <ConsultancyOffer />
      <ConsultancyProcess />
      <ConsultancyStatement />
      <ConsultancyCTA />
    </>
  );
}
