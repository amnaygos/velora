import type { Metadata } from "next";
import { PortfolioHero } from "@/components/sections/portfolio/PortfolioHero";
import { PortfolioGrid } from "@/components/sections/portfolio/PortfolioGrid";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Selected wellness, fitness, spa, hospitality, and residential environments by VELORA across Qatar and London — West Bay, Lusail, The Pearl, Msheireb, Al Waab, Al Rayyan, Holland Park, Marylebone, and the City. Seven projects documented before and after.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
    </>
  );
}
