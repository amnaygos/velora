import { Download } from "lucide-react";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { site } from "@/content/site";

const TOPICS = [
  "Wellness-space planning",
  "Equipment-selection frameworks",
  "Design language",
  "Material standards",
  "Operational models",
  "Hospitality wellness benchmarks",
];

export function BlueprintChapter() {
  return (
    <section className="bg-carbon px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <ArchitecturalRule />
      <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionEyebrow>CHAPTER 01</SectionEyebrow>
          <h2 className="mt-6 text-lg font-extralight uppercase leading-[1.12] tracking-[0.08em] text-white sm:text-xl">
            THE VELORA BLUEPRINT
          </h2>
          <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65 sm:text-lg">
            A complimentary guide created from over 100 completed projects
            across 50,000 SQM.
          </p>
          <p className="mt-10 space-y-1 text-lg font-light uppercase tracking-[0.06em] text-white/85">
            <span className="block">COMPLIMENTARY.</span>
            <span className="block">CONFIDENTIAL.</span>
            <span className="block">COMPREHENSIVE.</span>
          </p>
        </div>

        <div>
          <ul className="space-y-4">
            {TOPICS.map((topic, index) => (
              <li
                key={topic}
                className="flex items-baseline gap-4 border-b border-white/8 pb-4 text-[12px] uppercase tracking-[0.18em] text-white/65"
              >
                <span className="text-[10px] text-olive">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {topic}
              </li>
            ))}
          </ul>
          <a
            href={site.blueprintPdf}
            download
            className="group mt-12 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white hover:text-carbon"
          >
            <Download size={14} strokeWidth={1.5} aria-hidden="true" />
            DOWNLOAD THE BLUEPRINT
          </a>
        </div>
      </div>
    </section>
  );
}
