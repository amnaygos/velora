import { GeneratedMedia } from "@/components/media/GeneratedMedia";
import { ArchitecturalReveal } from "@/components/motion/ArchitecturalReveal";
import type { Service } from "@/types/content";

export function ServiceChapter({ service }: { service: Service }) {
  return (
    <article
      id={`service-${service.index}`}
      data-service-chapter={service.index}
      className="border-t border-white/10 py-20 first:border-t-0 lg:py-28"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-olive">
        {service.index} — {service.discipline}
      </p>
      <h2 className="mt-5 text-lg font-extralight uppercase tracking-[0.08em] text-white sm:text-xl">
        {service.title}
      </h2>
      <p className="mt-6 max-w-xl text-lg font-light italic leading-[1.6] text-white/70">
        “{service.summary}”
      </p>
      <p className="mt-8 max-w-2xl text-base font-light leading-[1.75] text-white/65">
        {service.detail}
      </p>

      <ul className="mt-10 grid gap-x-12 gap-y-3 sm:grid-cols-2">
        {service.scope.map((item) => (
          <li
            key={item}
            className="flex items-baseline gap-3 text-[12px] uppercase tracking-[0.14em] text-white/55"
          >
            <span aria-hidden="true" className="h-px w-5 shrink-0 bg-olive/70" />
            {item}
          </li>
        ))}
      </ul>

      <ArchitecturalReveal className="mt-14 max-w-3xl">
        <GeneratedMedia
          id={service.mediaId}
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      </ArchitecturalReveal>
    </article>
  );
}
