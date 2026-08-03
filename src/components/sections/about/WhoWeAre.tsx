import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function WhoWeAre() {
  return (
    <section className="bg-carbon px-5 py-28 sm:px-8 lg:px-12">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionEyebrow>WHO WE ARE</SectionEyebrow>
          <div className="mt-10 space-y-8 text-lg font-light leading-[1.75] text-white/70 sm:text-xl">
            <p>
              We do not bring a template to a project. We bring precision,
              vision, and the accumulated intelligence of over two decades.
            </p>
            <p className="text-white">
              Every VELORA environment begins with a single question: what do
              you want people to feel?
            </p>
          </div>
        </div>
        <ArchitecturalReveal>
          <GeneratedMedia
            id="video-design-process"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </ArchitecturalReveal>
      </div>
    </section>
  );
}
