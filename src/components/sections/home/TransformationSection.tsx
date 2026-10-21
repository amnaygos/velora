import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TextLink } from "@/components/ui/TextLink";
import type { Project } from "@/types/project";

/**
 * Proof of execution: the same room, before and after, from one camera
 * position — at the scale of a family compound, and at the scale of a
 * single spare room.
 *
 * Two mirrored rows: the argument sits beside its proof, and the proof
 * swaps sides between rows so the chapter reads as a zig-zag rather than
 * one long column down the left margin.
 */
export function TransformationSection({ projects }: { projects: Project[] }) {
  // Featured work already runs as before/afters in Selected Work above, so
  // this chapter takes the next two transformations in portfolio order —
  // otherwise the same frames would run twice on one page.
  const [lead, home] = projects.filter((project) => !project.featured && project.transformation);
  if (!lead?.transformation || !home) return null;
  const homes = [home];

  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      {/* Row 1 — thesis on the left, compound-scale proof on the right */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <SectionEyebrow>BEFORE VELORA · AFTER VELORA</SectionEyebrow>
          <SplitTextReveal
            as="h2"
            lines={["WE DO NOT ARRIVE", "TO EMPTY ROOMS."]}
            className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.75rem]"
          />
          <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65 sm:text-lg">
            Every environment begins as something else — a concrete shell, an
            unused majlis, a basement nobody entered. Each frame here is one
            camera position, photographed twice.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <h3 className="text-base font-light uppercase tracking-[0.06em] text-white sm:text-lg">
              {lead.title}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
              {lead.location} — {lead.area} — {lead.delivery}
            </p>
          </div>
          <BeforeAfter
            beforeId={lead.transformation.before}
            afterId={lead.transformation.after}
            sizes="(min-width: 1024px) 58vw, 100vw"
            restPosition={50}
            maxHeightVh={72}
          />
        </div>
      </div>

      <div className="mt-20 lg:mt-24">
        <ArchitecturalRule />
      </div>

      {/* Row 2 — mirrored: home-scale proof on the left, its argument on the right */}
      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:order-2 lg:col-span-5">
          <p className="text-lg font-extralight uppercase leading-[1.15] tracking-[0.07em] text-white lg:text-xl">
            THE SAME AUTHORSHIP
            <br />
            APPLIES AT {home.area}.
          </p>
          <p className="mt-6 max-w-md text-base font-light leading-[1.7] text-white/60 sm:text-lg">
            Most of our work is smaller still. It is a family villa, a spare
            room that had been waiting years for a decision.
          </p>
        </div>

        <div className="space-y-12 lg:order-1 lg:col-span-7">
          {homes.map((project) => (
            <div key={project.slug}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <h3 className="text-sm font-light uppercase tracking-[0.06em] text-white sm:text-base">
                  {project.title}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  {project.location} — {project.area}
                </p>
              </div>
              <BeforeAfter
                beforeId={project.transformation!.before}
                afterId={project.transformation!.after}
                sizes="(min-width: 1024px) 58vw, 100vw"
                restPosition={50}
                maxHeightVh={64}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 lg:mt-20">
        <TextLink href="/portfolio" transitionLabel="VELORA — PORTFOLIO">
          SEE EVERY TRANSFORMATION
        </TextLink>
      </div>
    </section>
  );
}
