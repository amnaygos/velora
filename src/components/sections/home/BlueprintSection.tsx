import { BlueprintForm } from "@/components/forms/BlueprintForm";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

/**
 * Chapter 10 — the Wellness Blueprint editorial lead section.
 */
export function BlueprintSection() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionEyebrow>VELORA — INTELLIGENCE</SectionEyebrow>
          <h2 className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white">
            THE VELORA
            <br />
            WELLNESS BLUEPRINT
          </h2>
          <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65 sm:text-lg">
            Principles, frameworks, material standards, and operational
            intelligence shaped through more than 100 completed projects
            across 50,000 SQM.
          </p>
          <p className="mt-12 space-y-1 text-base font-light uppercase tracking-[0.06em] text-white/85 sm:text-lg">
            <span className="block">COMPLIMENTARY.</span>
            <span className="block">CONFIDENTIAL.</span>
            <span className="block">COMPREHENSIVE.</span>
          </p>
        </div>

        <div className="lg:pt-24">
          <BlueprintForm />
        </div>
      </div>
    </section>
  );
}
