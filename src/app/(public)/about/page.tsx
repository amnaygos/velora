import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { WhoWeAre } from "@/components/sections/about/WhoWeAre";
import { VeloraApproach } from "@/components/sections/about/VeloraApproach";
import { AboutCredentials } from "@/components/sections/about/AboutCredentials";
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
      <WhoWeAre />
      <VeloraApproach />
      <AboutCredentials />
      <AboutPhilosophy />
      <AboutCTA />
    </>
  );
}
