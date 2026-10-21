import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function ServicesHero() {
  return (
    <section className="bg-carbon px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-12 lg:pt-32">
      <div>
        <SectionEyebrow>VELORA — SERVICES</SectionEyebrow>
        <SplitTextReveal
          as="h1"
          lines={["EVERY DISCIPLINE.", "ONE STANDARD."]}
          className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.9rem]"
          start="top 95%"
        />
        <p className="mt-10 max-w-xl text-base font-light leading-[1.7] text-white/65 sm:text-lg">
          Eight disciplines, practised as one continuous lifecycle — from the
          first strategic conversation to the way a space runs on day 1,001.
        </p>
      </div>
    </section>
  );
}
