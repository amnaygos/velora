import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { consultancy } from "@/content/consultancy";

export function ConsultancyOffer() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <div className="mt-12">
        <SectionEyebrow>{consultancy.offerEyebrow}</SectionEyebrow>
      </div>

      <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2">
        {consultancy.offers.map((offer) => (
          <article key={offer.index} className="bg-carbon p-8 sm:p-10 lg:p-12">
            <div className="flex items-baseline gap-4">
              <span className="text-[11px] tracking-[0.28em] text-olive">
                {offer.index}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-white/12" />
            </div>
            <h2 className="mt-6 text-lg font-extralight uppercase tracking-[0.09em] text-white">
              {offer.title}
            </h2>
            <p className="mt-5 max-w-md text-sm font-light leading-[1.75] text-white/60 lg:text-base">
              {offer.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
