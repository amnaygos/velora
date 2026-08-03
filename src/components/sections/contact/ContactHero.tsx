import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function ContactHero() {
  return (
    <section className="flex min-h-[60dvh] items-end bg-carbon px-5 pb-16 pt-40 sm:px-8 lg:px-12">
      <div>
        <SectionEyebrow>VELORA — CONTACT</SectionEyebrow>
        <SplitTextReveal
          as="h1"
          lines={["BEGIN", "YOUR JOURNEY."]}
          className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.95rem]"
          start="top 95%"
        />
        <p className="mt-10 max-w-lg text-base font-light leading-[1.7] text-white/65 sm:text-lg">
          Your enquiry goes directly to our principals. We do not use intake
          teams or automated responses.
        </p>
      </div>
    </section>
  );
}
