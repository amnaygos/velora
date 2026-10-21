import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { ButtonLink } from "@/components/ui/Button";
import { consultancy } from "@/content/consultancy";

export function ConsultancyCTA() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <SplitTextReveal
        as="h2"
        lines={[...consultancy.cta.lines]}
        className="mt-16 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.8rem]"
      />
      <div className="mt-14">
        <ButtonLink href="/contact" transitionLabel="VELORA — CONTACT">
          {consultancy.cta.action}
        </ButtonLink>
      </div>
    </section>
  );
}
