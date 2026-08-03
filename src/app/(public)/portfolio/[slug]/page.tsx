import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/components/sections/portfolio/ProjectHero";
import { ProjectNarrative } from "@/components/sections/portfolio/ProjectNarrative";
import { ProjectTransformation } from "@/components/sections/portfolio/ProjectTransformation";
import { ProjectGallery } from "@/components/sections/portfolio/ProjectGallery";
import { NextProject } from "@/components/sections/portfolio/NextProject";
import { getProject, nextProject, projects } from "@/content/projects";
import { getMediaOrNull } from "@/lib/media";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structuredData";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const hero = getMediaOrNull(project.heroMedia);
  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/portfolio/${project.slug}`,
    ogImage: hero?.src,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const hero = getMediaOrNull(project.heroMedia);
  const next = nextProject(project.slug);

  return (
    <>
      <ProjectHero project={project} />
      <ProjectNarrative project={project} />
      <ProjectTransformation project={project} />
      <ProjectGallery project={project} />
      <NextProject project={next} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            projectJsonLd(project, hero?.src),
            breadcrumbJsonLd([
              { name: "Portfolio", path: "/portfolio" },
              { name: project.title, path: `/portfolio/${project.slug}` },
            ]),
          ]),
        }}
      />
    </>
  );
}
