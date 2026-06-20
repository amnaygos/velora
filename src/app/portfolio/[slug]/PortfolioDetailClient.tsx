"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { projectData } from "./projectData";

const allProjectSlugs = Object.keys(projectData);

export default function PortfolioDetailClient({ slug }: { slug: string }) {
  const project = projectData[slug || ""];
  const currentIndex = allProjectSlugs.indexOf(slug || "");
  const prevSlug = currentIndex > 0 ? allProjectSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allProjectSlugs.length - 1 ? allProjectSlugs[currentIndex + 1] : null;
  const prevProject = prevSlug ? projectData[prevSlug] : null;
  const nextProject = nextSlug ? projectData[nextSlug] : null;
  const hero = useRef<HTMLDivElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(hero.current, { scale: 1.05 }, { scale: 1, duration: 2, ease: "power2.out" });
      gsap.fromTo(meta.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" });
      gsap.fromTo(content.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power2.out" });
    });
    return () => ctx.revert();
  }, [slug]);
  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-carbon">
      <div className="text-center">
        <h1 className="text-4xl mb-4">PROJECT NOT FOUND</h1>
        <Link href="/portfolio" className="text-[11px] tracking-[0.15em] text-olive hover:text-white transition-colors">&larr; BACK TO PORTFOLIO</Link>
      </div>
    </div>
  );
  return (
    <div className="bg-carbon">
      <section className="relative w-full h-[70vh] md:h-screen overflow-hidden">
        <div ref={hero} className="absolute inset-0"><img src={project.heroImage} alt={project.name} className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 p-6 md:p-16 z-10">
          <h1 className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.95] tracking-[0.05em]">{project.name}</h1>
        </div>
      </section>
      <div ref={meta} className="w-full border-b border-white/5 py-6 md:py-8 px-6 md:px-16 opacity-0">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <span className="text-[10px] md:text-[11px] font-normal tracking-[0.15em] text-white/50">PROJECT TYPE: <span className="text-white/80">{project.type}</span></span>
          <span className="text-[10px] md:text-[11px] font-normal tracking-[0.15em] text-white/50">LOCATION: <span className="text-white/80">{project.location}</span></span>
          <span className="text-[10px] md:text-[11px] font-normal tracking-[0.15em] text-white/50">SERVICES: <span className="text-white/80">{project.services.join(" · ")}</span></span>
        </div>
      </div>
      <section ref={content} className="w-full py-12 md:py-20 px-6 md:px-16 opacity-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 mb-12 md:mb-20">
            {project.galleryImages.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[50vw] h-[50vh] md:h-[70vh] overflow-hidden">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="max-w-[680px]">
            <h2 className="text-[28px] md:text-[36px] font-light leading-[1.2] tracking-[0.04em] mb-6">{project.name}</h2>
            <p className="text-[14px] md:text-[16px] font-light leading-[1.8] tracking-[0.02em] text-white/70 mb-8">{project.description}</p>
            {project.narrative.map((p, i) => <p key={i} className="text-[13px] md:text-[14px] font-light leading-[1.8] tracking-[0.02em] text-white/60 mb-6">{p}</p>)}
          </div>
        </div>
      </section>
      <section className="w-full bg-shadow py-[80px] md:py-[120px] px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto text-center">
          <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-6">INTERESTED IN A SIMILAR PROJECT?</h3>
          <Link href="/contact" className="btn-outline">REQUEST A CONSULTATION</Link>
        </div>
      </section>
      {/* TODO: Implement real related projects from projectData */}
      <section className="w-full py-12 md:py-16 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {prevProject && prevSlug ? (
            <Link href={`/portfolio/${prevSlug}`} className="group flex flex-col gap-1 max-w-[45%]">
              <span className="text-[8px] tracking-[0.35em] text-white/30 group-hover:text-olive transition-colors duration-300">&larr; PREVIOUS</span>
              <span className="text-[11px] md:text-[13px] font-light tracking-[0.04em] text-white/70 group-hover:text-white transition-colors duration-300 leading-tight">{prevProject.name}</span>
            </Link>
          ) : <div />}
          <Link href="/portfolio" className="text-[9px] tracking-[0.3em] text-white/25 hover:text-olive transition-colors duration-300 hidden sm:block">
            ALL WORK
          </Link>
          {nextProject && nextSlug ? (
            <Link href={`/portfolio/${nextSlug}`} className="group flex flex-col gap-1 items-end max-w-[45%]">
              <span className="text-[8px] tracking-[0.35em] text-white/30 group-hover:text-olive transition-colors duration-300">NEXT &rarr;</span>
              <span className="text-[11px] md:text-[13px] font-light tracking-[0.04em] text-white/70 group-hover:text-white transition-colors duration-300 leading-tight text-right">{nextProject.name}</span>
            </Link>
          ) : <div />}
        </div>
      </section>
    </div>
  );
}
