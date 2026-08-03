import type { Project } from "@/types/project";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: "hello@velora.qa",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Safwa Building, Gate 20, Second Floor, Barwa Commercial Avenue",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
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
