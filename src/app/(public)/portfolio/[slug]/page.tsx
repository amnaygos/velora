import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/components/sections/portfolio/ProjectHero";
import { ProjectNarrative } from "@/components/sections/portfolio/ProjectNarrative";
import { ProjectTransformation } from "@/components/sections/portfolio/ProjectTransformation";
import { ProjectGallery } from "@/components/sections/portfolio/ProjectGallery";
import { NextProject } from "@/components/sections/portfolio/NextProject";
import { getProject, getProjects } from "@/lib/website";
import { getMediaOrNull } from "@/lib/media";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structuredData";

// Published case studies are pre-rendered; one published later renders on its first visit.
export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
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
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];

  const hero = getMediaOrNull(project.heroMedia);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <ProjectHero project={project} />
      <ProjectNarrative project={project} />
      <ProjectTransformation project={project} />
      <ProjectGallery project={project} />
      {projects.length > 1 ? <NextProject project={next} projects={projects} /> : null}
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
