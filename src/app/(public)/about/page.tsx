import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { VeloraApproach } from "@/components/sections/about/VeloraApproach";
import { AboutPhilosophy } from "@/components/sections/about/AboutPhilosophy";
import { AboutCTA } from "@/components/sections/about/AboutCTA";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "VELORA is a premium wellness design-build studio in Doha and London — 50,000+ SQM completed, 100+ projects delivered, 20+ years of experience.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <VeloraApproach />
      <AboutPhilosophy />
      <AboutCTA />
    </>
  );
}
