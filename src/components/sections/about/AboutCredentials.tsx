import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { site } from "@/content/site";

export function AboutCredentials() {
  return (
    <section className="bg-carbon px-5 py-28 sm:px-8 lg:px-12">
      <ArchitecturalRule />
      <SplitTextReveal
        lines={[
          "50,000 SQM COMPLETED.",
          "100+ PROJECTS DELIVERED.",
          "20+ YEARS OF EXPERIENCE.",
        ]}
        className="mt-16 text-lg font-extralight uppercase leading-[1.3] tracking-[0.07em] text-white sm:text-xl"
        stagger={0.15}
      />
      <p className="mt-16 text-[10px] uppercase tracking-[0.34em] text-white/45">
        {site.districts}
      </p>
    </section>
  );
}
