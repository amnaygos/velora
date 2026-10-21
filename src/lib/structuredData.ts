import type { Project } from "@/types/project";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";

export function organizationJsonLd(studio: { email: string | null; address: string[]; socials: { href: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    ...(studio.email ? { email: studio.email } : {}),
    ...(studio.address.length
      ? {
          address: {
            "@type": "PostalAddress",
            // The last line is the city and country; everything above it is the street.
            streetAddress: studio.address.slice(0, -1).join(", "),
            addressLocality: "Doha",
            addressCountry: "QA",
          },
        }
      : {}),
    ...(studio.socials.length ? { sameAs: studio.socials.map((s) => s.href) } : {}),
    areaServed: [
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "United Kingdom" },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function projectJsonLd(project: Project, imageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    locationCreated: project.location,
    dateCreated: project.year,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    ...(imageUrl ? { image: `${SITE_URL}${imageUrl}` } : {}),
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
