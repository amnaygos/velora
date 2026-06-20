import { projectData } from "./projectData";
import PortfolioDetailClient from "./PortfolioDetailClient";

export function generateStaticParams() {
  return Object.keys(projectData).map((slug) => ({ slug }));
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortfolioDetailClient slug={slug} />;
}
