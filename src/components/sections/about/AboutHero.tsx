import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { VeloraWordmark } from "@/components/brand/VeloraWordmark";

export function AboutHero() {
  return (
    <section className="relative flex min-h-[92dvh] items-end overflow-hidden bg-carbon px-5 pb-24 pt-40 sm:px-8 lg:px-12">
      {/* oversized cropped wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14vw] top-16 w-[85vw] select-none text-white/[0.05]"
      >
        <VeloraWordmark className="h-auto w-full" />
      </div>

      <div className="relative">
        <SectionEyebrow>VELORA — ABOUT</SectionEyebrow>
        <SplitTextReveal
          as="h1"
          lines={["PIONEERING WELLNESS.", "PROVEN RESULTS."]}
          className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.9rem]"
          start="top 95%"
        />
      </div>
    </section>
  );
}
