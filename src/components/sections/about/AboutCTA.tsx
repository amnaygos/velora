import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { ButtonLink } from "@/components/ui/Button";

export function AboutCTA() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <SplitTextReveal
        as="h2"
        lines={["HAVE A PROJECT", "IN MIND?"]}
        className="mt-16 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.8rem]"
      />
      <div className="mt-14">
        <ButtonLink href="/contact" transitionLabel="VELORA — CONTACT">
          BEGIN A CONVERSATION
        </ButtonLink>
      </div>
    </section>
  );
}
