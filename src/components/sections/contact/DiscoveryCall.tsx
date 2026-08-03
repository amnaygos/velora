import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { buildMailtoHref } from "@/lib/formSubmission";
import { ArrowRight } from "lucide-react";

export function DiscoveryCall() {
  return (
    <section className="bg-carbon px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <ArchitecturalRule />
      <SplitTextReveal
        as="h2"
        lines={["PREFER TO SPEAK FIRST?"]}
        className="mt-14 text-lg font-extralight uppercase tracking-[0.08em] text-white sm:text-xl"
      />
      <a
        href={buildMailtoHref(
          "Discovery call — VELORA",
          "I would like to book a complimentary 30-minute discovery call.\n\nPreferred days and times:\n",
        )}
        className="group mt-10 inline-flex items-center gap-4 text-base font-light uppercase tracking-[0.1em] text-white/80 transition-colors duration-500 hover:text-white sm:text-lg"
      >
        <span className="relative">
          BOOK A COMPLIMENTARY 30-MINUTE DISCOVERY CALL
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-olive transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
          />
        </span>
        <ArrowRight
          aria-hidden="true"
          size={22}
          strokeWidth={1.25}
          className="shrink-0 transition-transform duration-500 group-hover:translate-x-2"
        />
      </a>
    </section>
  );
}
