import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import type { Project } from "@/types/project";

const CHAPTERS: Array<{
  key: "brief" | "response" | "outcome";
  label: string;
}> = [
  { key: "brief", label: "BRIEF" },
  { key: "response", label: "DESIGN RESPONSE" },
  { key: "outcome", label: "OUTCOME" },
];

export function ProjectNarrative({ project }: { project: Project }) {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="space-y-20">
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.key}
            className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-16"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
              {chapter.label}
            </p>
            <p className="max-w-3xl text-lg font-light leading-[1.65] text-white/80 sm:text-xl">
              {project[chapter.key]}
            </p>
          </div>
        ))}
      </div>

      {project.metrics?.length ? (
        <div className="mt-24">
          <ArchitecturalRule />
          <dl className="mt-10 grid gap-10 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dd className="text-xl font-extralight text-white sm:text-2xl">
                  {metric.value}
                </dd>
                <dt className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/40">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
