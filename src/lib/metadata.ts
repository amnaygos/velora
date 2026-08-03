import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://velora.qa";

export const SITE_NAME = "VELORA";

export const SITE_TAGLINE = "Where Wellness Meets Wonder";

export const SITE_DESCRIPTION =
  "VELORA is a refined wellness and leisure concept designed to elevate everyday living through thoughtful spaces, premium experiences, and a holistic approach to wellbeing.";

const OG_IMAGE = "/media/images/still-environment.webp";

export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  ogImage = OG_IMAGE,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage, width: 1600, height: 900, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`,
      description,
      images: [ogImage],
    },
  };
}
