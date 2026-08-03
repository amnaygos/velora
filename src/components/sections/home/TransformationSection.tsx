import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { getProject } from "@/content/projects";

const LEAD = "grand-training-hall";
const HOMES = ["al-waab-villa-gym", "the-yoga-alcove"];

/**
 * Proof of execution: the same room, before and after, from one camera
 * position — at tower scale, and at the scale of an ordinary family home.
 */
export function TransformationSection() {
  const lead = getProject(LEAD);
  const homes = HOMES.map(getProject).filter(
    (project): project is NonNullable<typeof project> =>
      Boolean(project?.transformation),
  );

  if (!lead?.transformation) return null;

  return (
    <section className="bg-carbon px-5 pb-16 pt-28 sm:px-8 lg:px-12">
      <SectionEyebrow>BEFORE VELORA · AFTER VELORA</SectionEyebrow>
      <SplitTextReveal
        as="h2"
        lines={["WE DO NOT ARRIVE", "TO EMPTY ROOMS."]}
        className="mt-8 max-w-4xl text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.75rem]"
      />
      <p className="mt-8 max-w-xl text-base font-light leading-[1.7] text-white/65 sm:text-lg">
        Every environment begins as something else — a concrete shell, an
        unused majlis, a basement nobody entered. Each frame below is one
        camera position, photographed twice.
      </p>

      <div className="mt-16">
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
          sizes="(min-width: 1024px) 90vw, 100vw"
          restPosition={50}
          maxHeightVh={72}
        />
      </div>

      <div className="mt-28">
        <ArchitecturalRule />
        <p className="mt-10 max-w-2xl text-lg font-extralight uppercase leading-[1.15] tracking-[0.07em] text-white">
          THE SAME AUTHORSHIP
          <br />
          APPLIES AT 34 SQM.
        </p>
        <p className="mt-6 max-w-xl text-base font-light leading-[1.7] text-white/60">
          Most of our work is not a tower. It is a family villa in Al Waab, a
          spare room that had been waiting years for a decision.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-14">
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
                sizes="(min-width: 1024px) 45vw, 100vw"
                restPosition={50}
                maxHeightVh={58}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8">
        <TextLink href="/portfolio" transitionLabel="VELORA — PORTFOLIO">
          SEE EVERY TRANSFORMATION
        </TextLink>
      </div>
    </section>
  );
}
