import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function StandardHero() {
  return (
    <section className="bg-carbon px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-12 lg:pt-32">
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
