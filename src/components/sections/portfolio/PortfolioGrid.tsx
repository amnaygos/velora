"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/sections/portfolio/ProjectCard";
import {
  PortfolioFilters,
  type PortfolioFilter,
} from "@/components/sections/portfolio/PortfolioFilters";
import type { Project } from "@/types/project";

/**
 * Asymmetric editorial grid with smooth category filtering. Layout
 * animations are handled by framer-motion; ratios are preserved by the
 * media assets themselves.
 */
export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<PortfolioFilter>("All");
  // Only offer the categories that have published work.
  const available = new Set(projects.map((project) => project.category));

  const visible =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <section className="bg-carbon px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
      <PortfolioFilters value={filter} onChange={setFilter} available={available} />

      <motion.div layout className="mt-14 columns-1 gap-10 sm:columns-2 lg:gap-14 xl:columns-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <div
              key={project.slug}
              className="mb-14 break-inside-avoid lg:mb-20"
              style={{
                paddingTop:
                  index % 4 === 1 ? "3rem" : index % 4 === 3 ? "1.5rem" : 0,
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-white/35">
        {visible.length} {visible.length === 1 ? "PROJECT" : "PROJECTS"}
        {filter !== "All" ? ` — ${filter.toUpperCase()}` : ""}
      </p>
    </section>
  );
}
