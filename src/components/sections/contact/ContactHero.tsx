import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function ContactHero() {
  return (
    <section className="bg-carbon px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-12 lg:pt-32">
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
