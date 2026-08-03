import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import type { Project } from "@/types/project";

/**
 * The transformation record: the room as found and the room as delivered,
 * from one camera position.
 */
export function ProjectTransformation({ project }: { project: Project }) {
  const transformation = project.transformation;
  if (!transformation) return null;

  return (
    <section
      className="bg-carbon px-5 pb-28 sm:px-8 lg:px-12"
      aria-label={`${project.title} — the transformation`}
    >
      <ArchitecturalRule />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-end lg:gap-16">
        <div>
          <SectionEyebrow>THE TRANSFORMATION</SectionEyebrow>
          <h2 className="mt-6 text-lg font-extralight uppercase leading-[1.12] tracking-[0.08em] text-white sm:text-xl">
            WHAT WAS
            <br />
            ALREADY HERE.
          </h2>
        </div>
        <p className="max-w-xl text-base font-light leading-[1.7] text-white/65 lg:pb-2">
          {transformation.condition}
        </p>
      </div>

      <BeforeAfter
        beforeId={transformation.before}
        afterId={transformation.after}
        className="mt-12"
        sizes="(min-width: 1024px) 90vw, 100vw"
        restPosition={48}
        maxHeightVh={72}
      />
    </section>
  );
}
