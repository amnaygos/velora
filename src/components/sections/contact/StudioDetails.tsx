import { site, socials } from "@/content/site";

export function StudioDetails() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
        STUDIO
      </p>
      <a
        href={`mailto:${site.email}`}
        className="mt-6 block text-base font-light uppercase tracking-[0.14em] text-white transition-colors hover:text-olive"
      >
        {site.email.toUpperCase()}
      </a>

      <address className="mt-10 space-y-1 not-italic">
        {site.address.map((line) => (
          <p
            key={line}
            className="text-[11px] uppercase leading-relaxed tracking-[0.22em] text-white/55"
          >
            {line}
          </p>
        ))}
      </address>

      <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-white/70">
        {site.cities}
      </p>

      <p className="mt-10 max-w-xs text-sm font-light leading-[1.7] text-white/55">
        A member of our principals team will review your message personally
        and respond within one business day.
      </p>

      <ul className="mt-10 flex gap-6">
        {socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
