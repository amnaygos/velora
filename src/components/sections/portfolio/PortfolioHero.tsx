import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function PortfolioHero() {
  return (
    <section className="flex min-h-[60dvh] items-end bg-carbon px-5 pb-16 pt-40 sm:px-8 lg:px-12">
      <div>
        <SectionEyebrow>VELORA — PORTFOLIO</SectionEyebrow>
        <SplitTextReveal
          as="h1"
          lines={["WORK THAT", "CHANGES THE PRACTICE."]}
          className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[2rem]"
          start="top 95%"
        />
      </div>
    </section>
  );
}
