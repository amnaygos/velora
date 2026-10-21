"use client";

import { useState } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ExternalTextLink } from "@/components/ui/TextLink";
import { useStudio } from "@/components/providers/StudioProvider";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Live Google map of the studio, restyled into the VELORA palette with a
 * CSS filter chain (grayscale → invert → olive-tinted sepia) — no API key
 * required. The map stays inert until deliberately enabled so it never
 * captures the page's scroll; the generated location study sits beneath
 * as the loading backdrop.
 */
export function StudioMap() {
  const [interactive, setInteractive] = useState(false);
  const backdrop = getMedia("still-contact-location");
  const { address } = useStudio();
  if (!address.length) return null;

  // Keyless Google Maps embed centred on the studio address.
  const query = address.join(", ");
  const EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section
      className="relative bg-carbon px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"
      aria-label="Studio location"
    >
      <div className="relative h-[52vh] overflow-hidden border border-white/10 sm:h-[62vh]">
        {/* generated location study shows while the tiles arrive */}
        <ResponsiveImage
          asset={backdrop}
          keepRatio={false}
          className="absolute inset-0 h-full w-full opacity-50"
          sizes="100vw"
        />

        <iframe
          src={EMBED_SRC}
          title={`Map — ${query}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-hidden={!interactive}
          className={cn(
            "absolute inset-0 h-full w-full scale-[1.04] border-0",
            !interactive && "pointer-events-none",
          )}
          style={{
            // Carbon-and-olive regrade of the standard Google tiles.
            filter:
              "grayscale(1) invert(0.92) brightness(0.88) contrast(0.86) sepia(0.32) hue-rotate(38deg) saturate(0.6)",
          }}
        />

        {/* vignette so the map sits inside the page's light instead of on it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 52%, rgba(28,28,28,0.6) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-olive/50"
        />

        {/* olive crosshair over the studio */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="absolute -left-8 top-0 h-px w-16 -translate-y-1/2 bg-olive/90" />
          <span className="absolute left-0 -top-8 h-16 w-px -translate-x-1/2 bg-olive/90" />
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-olive bg-carbon/60" />
        </div>

        {/* address plate */}
        <div className="pointer-events-none absolute bottom-0 left-0 p-6 sm:p-10">
          <div className="border border-white/15 bg-carbon/85 px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
              DOHA STUDIO
            </p>
            <p className="mt-3 text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/75">
              {address.slice(0, 2).join(" · ")}
              {address.length > 2 ? (
                <>
                  <br />
                  {address.slice(-2).join(", ")}
                </>
              ) : null}
            </p>
          </div>
        </div>

        {/* The map only takes pointer input once asked to. */}
        {!interactive ? (
          <button
            type="button"
            onClick={() => setInteractive(true)}
            className="absolute right-4 top-4 border border-white/30 bg-carbon/85 px-4 py-3 text-[9px] font-medium uppercase tracking-[0.24em] text-white/80 transition-colors duration-500 hover:border-olive hover:text-white sm:right-6 sm:top-6"
          >
            ENABLE MAP
          </button>
        ) : (
          <p className="pointer-events-none absolute right-4 top-4 border border-olive/40 bg-carbon/85 px-4 py-3 text-[9px] uppercase tracking-[0.24em] text-olive sm:right-6 sm:top-6">
            MAP ACTIVE
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <ExternalTextLink href={MAPS_LINK} withArrow>
          OPEN IN GOOGLE MAPS
        </ExternalTextLink>
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
          BARWA COMMERCIAL AVENUE · DOHA
        </p>
      </div>
    </section>
  );
}
