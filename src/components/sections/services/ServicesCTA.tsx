import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { ButtonLink } from "@/components/ui/Button";
import { servicesClosing } from "@/content/services";

export function ServicesCTA() {
  return (
    <section className="bg-carbon px-5 py-32 sm:px-8 lg:px-12 lg:py-44">
      <ArchitecturalRule />
      <SplitTextReveal
        as="h2"
        lines={[...servicesClosing.lines]}
        className="mt-16 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.8rem]"
        stagger={0.14}
      />
      <div className="mt-14">
        <ButtonLink href="/contact" transitionLabel="VELORA — CONTACT">
          {servicesClosing.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
