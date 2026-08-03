import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function StandardHero() {
  return (
    <section className="flex min-h-[70dvh] items-end bg-carbon px-5 pb-20 pt-40 sm:px-8 lg:px-12">
      <div>
        <SectionEyebrow>THE VELORA STANDARD</SectionEyebrow>
        <SplitTextReveal
          as="h1"
          lines={["INTELLIGENCE FOR THOSE", "WHO REFUSE TO COMPROMISE."]}
          className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.75rem]"
          start="top 95%"
        />
      </div>
    </section>
  );
}
