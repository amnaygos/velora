import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { homeTestimonial } from "@/content/testimonials";
import { getMedia } from "@/lib/media";

/**
 * Chapter 09 — one client sentence in a nearly empty carbon room.
 * The background is almost imperceptible; a long pause follows.
 */
export function TestimonialSection() {
  const bg = getMedia("still-quote-bg");

  return (
    <section
      className="relative overflow-hidden bg-carbon px-5 pb-[26vh] pt-[22vh] sm:px-8 lg:px-12"
      aria-label="Client words"
    >
      <div className="absolute inset-0 opacity-[0.16]" aria-hidden="true">
        <ResponsiveImage
          asset={bg}
          keepRatio={false}
          className="h-full w-full"
          sizes="100vw"
        />
      </div>

      <figure className="relative mx-auto max-w-5xl">
        <blockquote>
          <SplitTextReveal
            lines={[...homeTestimonial.quoteLines]}
            className="text-center text-lg font-extralight uppercase leading-[1.2] tracking-[0.07em] text-white sm:text-xl"
            stagger={0.16}
          />
        </blockquote>
        <figcaption className="mt-14 text-center text-[10px] uppercase tracking-[0.34em] text-white/45">
          {homeTestimonial.attribution}
        </figcaption>
      </figure>
    </section>
  );
}
