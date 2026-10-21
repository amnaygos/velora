import type { Metadata } from "next";
import { PortfolioHero } from "@/components/sections/portfolio/PortfolioHero";
import { PortfolioGrid } from "@/components/sections/portfolio/PortfolioGrid";
import { pageMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/website";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Selected wellness, fitness, spa, hospitality, and residential environments by VELORA across Qatar and London — West Bay, Lusail, The Pearl, Msheireb, Al Waab, Al Rayyan, Holland Park, Marylebone, and the City. Projects documented before and after.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid projects={projects} />
    </>
  );
}
