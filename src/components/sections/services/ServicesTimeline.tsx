"use client";

import { useRef, useState } from "react";
import { ResponsiveVideo } from "@/components/media/ResponsiveVideo";
import { ServiceChapter } from "@/components/sections/services/ServiceChapter";
import { services } from "@/content/services";
import { getMedia } from "@/lib/media";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The eight disciplines as one continuous lifecycle: a sticky index on
 * the left tracks the visitor's position through the scrollable chapters
 * on the right. A full-bleed film breaks the sequence at its midpoint.
 */
export function ServicesTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const chapters = sectionRef.current.querySelectorAll(
        "[data-service-chapter]",
      );
      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
      });
    },
    { scope: sectionRef },
  );

  const poolFilm = getMedia("video-lap-pool");

  return (
    <section ref={sectionRef} className="bg-carbon px-5 pb-24 sm:px-8 lg:px-12">
      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        {/* Sticky index (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <p
              aria-hidden="true"
              className="text-[2.8rem] font-extralight leading-none text-white/10 transition-all duration-500"
            >
              {services[active]?.index ?? "01"}
            </p>
            <ol className="mt-10 space-y-3">
              {services.map((service, index) => (
                <li key={service.index}>
                  <a
                    href={`#service-${service.index}`}
                    className={cn(
                      "flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] transition-colors duration-500",
                      index === active
                        ? "text-white"
                        : "text-white/35 hover:text-white/70",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px transition-all duration-500",
                        index === active ? "w-8 bg-olive" : "w-4 bg-white/25",
                      )}
                    />
                    {service.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Chapters with a persistent progress line on mobile */}
        <div className="relative border-l border-white/10 pl-6 lg:border-l-0 lg:pl-0">
          {services.slice(0, 4).map((service) => (
            <ServiceChapter key={service.index} service={service} />
          ))}

          {/* full-bleed film break */}
          <div className="relative -mx-5 my-10 h-[52vh] overflow-hidden sm:-mx-8 lg:mx-0 lg:h-[64vh]">
            <ResponsiveVideo asset={poolFilm} />
            <div className="absolute inset-0 bg-carbon/30" />
          </div>

          {services.slice(4).map((service) => (
            <ServiceChapter key={service.index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
