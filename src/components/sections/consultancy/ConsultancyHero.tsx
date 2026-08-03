import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { consultancy } from "@/content/consultancy";
import { getMedia } from "@/lib/media";

export function ConsultancyHero() {
  const media = getMedia("portfolio-city-performance-floor");
  return (
    <section className="bg-carbon px-5 pb-20 pt-40 sm:px-8 lg:px-12">
      <SectionEyebrow>{consultancy.eyebrow}</SectionEyebrow>
      <SplitTextReveal
        as="h1"
        lines={[...consultancy.heroLines]}
        className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.85rem]"
        start="top 95%"
      />
      <p className="mt-10 max-w-2xl text-base font-light leading-[1.75] text-white/65 sm:text-lg">
        {consultancy.intro}
      </p>

      <ArchitecturalReveal className="mt-16">
        <ResponsiveImage
          asset={media}
          keepRatio={false}
          className="h-[46vh] w-full sm:h-[58vh] lg:h-[68vh]"
          sizes="100vw"
          eager
        />
      </ArchitecturalReveal>
    </section>
  );
}
