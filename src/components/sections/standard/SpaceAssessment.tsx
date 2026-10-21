import { AssessmentQuiz } from "@/components/forms/AssessmentQuiz";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function SpaceAssessment() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionEyebrow>CHAPTER 02</SectionEyebrow>
          <h2 className="mt-6 text-lg font-extralight uppercase leading-[1.12] tracking-[0.08em] text-white sm:text-xl">
            DESIGN YOUR IDEAL
            <br />
            WELLNESS SPACE
          </h2>
          <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65">
            Three questions. A precise recommendation of the VELORA
            disciplines your project would draw on — computed here, kept
            nowhere.
          </p>
        </div>
        <AssessmentQuiz />
      </div>
    </section>
  );
}
