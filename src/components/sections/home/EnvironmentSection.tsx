"use client";

import { useRef } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { environmentCopy, environmentLabels } from "@/content/site";
import { getMedia } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Chapter 03 — "The environment is the product." A scroll-controlled
 * study (~220vh): the architectural image assembles through three
 * material masks while narrative labels and diagram lines activate,
 * ending with the completed space, free of diagrams.
 */
export function EnvironmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const asset = getMedia("still-environment");
  const residential = getMedia("still-residential");

  useGSAP(
    () => {
      const section = sectionRef.current;
      // The scrub choreography only exists where the sticky column does
      // (lg+). Below that the section is static and fully readable.
      if (!section || reducedMotion || !isDesktop) return;

      const labels = gsap.utils.toArray<HTMLElement>("[data-env-label]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          refreshPriority: 4,
        },
      });

      // Three-panel material assembly of the image.
      tl.fromTo(
        "[data-env-panel='0']",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE },
        0,
      )
        .fromTo(
          "[data-env-panel='1']",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE },
          0.5,
        )
        .fromTo(
          "[data-env-panel='2']",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE },
          1.0,
        );

      // Diagram lines and dimension ticks appear, align, then withdraw.
      tl.fromTo(
        "[data-env-diagram] [data-line-h]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: EASE, stagger: 0.1 },
        0.9,
      )
        .fromTo(
          "[data-env-diagram] [data-line-v]",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: EASE, stagger: 0.1 },
          1.2,
        )
        .fromTo(
          "[data-env-dim]",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "none", stagger: 0.08 },
          1.8,
        )
        .to(
          "[data-env-diagram], [data-env-dim]",
          { opacity: 0, duration: 0.6, ease: "none" },
          3.4,
        );

      // Label activation across five stages.
      labels.forEach((label, index) => {
        const at = 0.2 + index * 0.85;
        tl.to(
          label,
          { color: "rgba(255,255,255,1)", duration: 0.25, ease: "none" },
          at,
        ).to(
          label.querySelector("[data-env-label-rule]"),
          { scaleX: 1, duration: 0.3, ease: EASE },
          at,
        );
        if (index < labels.length - 1) {
          tl.to(
            label,
            { color: "rgba(255,255,255,0.35)", duration: 0.25, ease: "none" },
            at + 0.85,
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-carbon lg:h-[220vh]"
      aria-label="The environment is the product"
    >
      <div className="lg:sticky lg:top-0 lg:h-[100dvh]">
        <div className="grid h-full gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-20 lg:px-12">
          {/* Left — thesis and labels */}
          <div>
            <SectionEyebrow>VELORA — THE PRODUCT</SectionEyebrow>
            <h2 className="mt-8 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white lg:text-[1.7rem]">
              THE ENVIRONMENT
              <br />
              IS THE PRODUCT.
            </h2>
            <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/65 sm:text-lg">
              {environmentCopy}
            </p>

            <ul className="mt-12 space-y-4" aria-label="What VELORA authors">
              {environmentLabels.map((label) => (
                <li
                  key={label}
                  data-env-label
                  className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/35"
                >
                  <span
                    data-env-label-rule
                    aria-hidden="true"
                    className="h-px w-8 origin-left scale-x-0 bg-olive"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — assembling image with technical overlay */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-shadow">
              {[0, 1, 2].map((panel) => (
                <div
                  key={panel}
                  data-env-panel={panel}
                  className="absolute inset-0"
                >
                  <ResponsiveImage
                    asset={panel === 1 ? residential : asset}
                    keepRatio={false}
                    className="absolute inset-0 h-full w-full"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    imgClassName={panel === 1 ? "opacity-90" : undefined}
                  />
                </div>
              ))}

              {/* technical drawing layer — desktop choreography only */}
              <div
                data-env-diagram
                aria-hidden="true"
                className={
                  reducedMotion
                    ? "hidden"
                    : "pointer-events-none absolute inset-0 hidden lg:block"
                }
              >
                <span
                  data-line-h
                  className="absolute left-[6%] top-[22%] h-px w-[70%] origin-left bg-olive/70"
                />
                <span
                  data-line-h
                  className="absolute bottom-[18%] left-[14%] h-px w-[58%] origin-left bg-white/40"
                />
                <span
                  data-line-v
                  className="absolute left-[24%] top-[10%] h-[64%] w-px origin-top bg-white/40"
                />
                <span
                  data-line-v
                  className="absolute right-[18%] top-[26%] h-[52%] w-px origin-top bg-olive/70"
                />
              </div>
              <span
                data-env-dim
                aria-hidden="true"
                className={
                  reducedMotion
                    ? "hidden"
                    : "absolute left-[6%] top-[18%] hidden text-[9px] tracking-[0.3em] text-olive/90 lg:block"
                }
              >
                24.60 M
              </span>
              <span
                data-env-dim
                aria-hidden="true"
                className={
                  reducedMotion
                    ? "hidden"
                    : "absolute bottom-[14%] right-[16%] hidden text-[9px] tracking-[0.3em] text-white/60 lg:block"
                }
              >
                RL +3.400
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
