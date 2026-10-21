import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { consultancy } from "@/content/consultancy";
import { getMedia } from "@/lib/media";

/**
 * Who the advisory is for, set against a material image, closing on the
 * studio's operating conviction.
 */
export function ConsultancyStatement() {
  const media = getMedia("still-environment");
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div>
          <SectionEyebrow>{consultancy.audienceEyebrow}</SectionEyebrow>
          <ul className="mt-10 space-y-4">
            {consultancy.audience.map((who, index) => (
              <li
                key={who}
                className="flex items-baseline gap-4 border-b border-white/8 pb-4 text-[13px] uppercase tracking-[0.14em] text-white/70"
              >
                <span className="text-[10px] text-olive">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {who}
              </li>
            ))}
          </ul>
        </div>

        <ArchitecturalReveal>
          <ResponsiveImage
            asset={media}
            keepRatio={false}
            className="h-[44vh] w-full lg:h-[56vh]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </ArchitecturalReveal>
      </div>

      <div className="mt-28 max-w-4xl">
        <SplitTextReveal
          as="h2"
          lines={[...consultancy.statement.lines]}
          className="text-lg font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white sm:text-xl"
        />
        <p className="mt-8 max-w-2xl text-base font-light leading-[1.75] text-white/65 sm:text-lg">
          {consultancy.statement.body}
        </p>
      </div>
    </section>
  );
}
