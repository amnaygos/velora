import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

/**
 * The two philosophies restated with imagery the homepage does not use,
 * closing on the two studio cities.
 */
export function AboutPhilosophy() {
  return (
    <section className="bg-carbon px-5 py-28 sm:px-8 lg:px-12">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <ArchitecturalReveal>
          <GeneratedMedia id="still-yoga" sizes="(min-width: 1024px) 45vw, 100vw" />
        </ArchitecturalReveal>
        <SplitTextReveal
          as="h2"
          lines={["THE SPACE SHAPES", "THE PRACTICE."]}
          className="text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white"
        />
      </div>

      <div className="mt-32 grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <SplitTextReveal
          as="h2"
          lines={["LUXURY WITHOUT", "ANNOUNCEMENT."]}
          className="order-2 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:order-1"
        />
        <ArchitecturalReveal className="order-1 lg:order-2">
          <GeneratedMedia
            id="still-residential"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </ArchitecturalReveal>
      </div>

      {/* where we work */}
      <div className="mt-32 grid gap-8 sm:grid-cols-2">
        <figure>
          <ArchitecturalReveal>
            <GeneratedMedia id="still-doha" sizes="(min-width: 640px) 50vw, 100vw" />
          </ArchitecturalReveal>
          <figcaption className="mt-4 text-[10px] uppercase tracking-[0.34em] text-white/45">
            DOHA — SAFWA BUILDING, BARWA COMMERCIAL AVENUE
          </figcaption>
        </figure>
        <figure>
          <ArchitecturalReveal delay={0.15}>
            <GeneratedMedia
              id="portfolio-marylebone-recovery-atelier"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </ArchitecturalReveal>
          <figcaption className="mt-4 text-[10px] uppercase tracking-[0.34em] text-white/45">
            LONDON — BY APPOINTMENT
          </figcaption>
        </figure>
      </div>

      <p className="mt-14 max-w-2xl text-lg font-light leading-[1.7] text-white/65">
        VELORA works between Doha and London. We do not export a house style
        from one to the other — we build in the light, the climate, and the
        materials of each place, for the people who live there.
      </p>
    </section>
  );
}
