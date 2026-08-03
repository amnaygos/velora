import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ArchitecturalRule } from "@/components/motion/ArchitecturalRule";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

const TOPICS = [
  "ARCHITECTURE",
  "DESIGN",
  "OPERATIONAL EXCELLENCE",
  "EMERGING STANDARDS",
  "PRIVATE PROJECT SPOTLIGHTS",
];

export function VeloraEdit() {
  return (
    <section className="bg-carbon px-5 py-24 pb-36 sm:px-8 lg:px-12 lg:py-32">
      <ArchitecturalRule />
      <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionEyebrow>CHAPTER 03</SectionEyebrow>
          <h2 className="mt-6 text-lg font-extralight uppercase leading-[1.12] tracking-[0.08em] text-white sm:text-xl">
            THE VELORA EDIT
          </h2>
          <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65">
            Curated intelligence from the world’s most refined wellness
            environments.
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="text-[10px] uppercase tracking-[0.24em] text-white/50"
              >
                {topic}
              </li>
            ))}
          </ul>

          <p className="mt-12 text-base font-light uppercase leading-[1.5] tracking-[0.04em] text-white/85">
            NO NOISE.
            <br />
            NO PROMOTIONS.
            <br />
            <span className="text-white">
              ONLY WHAT EARNS A PLACE
              <br />
              IN YOUR INBOX.
            </span>
          </p>
        </div>

        <div className="lg:pt-16">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
