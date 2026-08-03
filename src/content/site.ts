import type { CredentialStat, SocialLink } from "@/types/content";

export const site = {
  name: "VELORA",
  tagline: "WHERE WELLNESS MEETS WONDER",
  taglineLines: ["WHERE WELLNESS", "MEETS WONDER"],
  positioning:
    "VELORA is a refined wellness and leisure concept designed to elevate everyday living through thoughtful spaces, premium experiences, and a holistic approach to wellbeing. Designed and built in Qatar and the United Kingdom.",
  email: "hello@velora.qa",
  cities: "DOHA · LONDON",
  region: "QATAR & THE UNITED KINGDOM",
  districts: "DOHA · LUSAIL · THE PEARL · LONDON",
  lifecycle: "DESIGN · BUILD · OPERATE",
  scrollLabel: "SCROLL TO ENTER",
  address: [
    "SAFWA BUILDING",
    "GATE 20",
    "SECOND FLOOR",
    "BARWA COMMERCIAL AVENUE",
    "DOHA, QATAR",
  ],
  copyrightYear: "2026",
  blueprintPdf: "/downloads/velora-wellness-blueprint.pdf",
} as const;

export const socials: SocialLink[] = [
  { label: "INSTAGRAM", href: "https://www.instagram.com" },
  { label: "LINKEDIN", href: "https://www.linkedin.com" },
  { label: "WHATSAPP", href: "https://www.whatsapp.com" },
];

export const credentials: CredentialStat[] = [
  { value: 50000, suffix: "+", label: "SQM COMPLETED" },
  { value: 100, suffix: "+", label: "PROJECTS DELIVERED" },
  { value: 20, suffix: "+", label: "YEARS OF EXPERIENCE" },
];

export const manifestoStatements: string[][] = [
  ["MOST WELLNESS SPACES", "ARE TREATED AS AFTERTHOUGHTS."],
  ["A ROOM.", "A FLOOR.", "EQUIPMENT PLACED INSIDE IT."],
  ["WE REPLACE THE GENERIC", "WITH THE INTENTIONAL."],
  ["WE DO NOT BUILD GYMS."],
  [
    "WE CRAFT ENVIRONMENTS",
    "THAT CHANGE HOW PEOPLE FEEL",
    "ABOUT WHERE THEY LIVE",
    "AND HOW THEY MOVE.",
  ],
];

/** Words that briefly shift to olive while their statement is active. */
export const manifestoAccents = [
  "AFTERTHOUGHTS.",
  "EQUIPMENT",
  "INTENTIONAL.",
  "GYMS.",
  "ENVIRONMENTS",
];

export const environmentLabels = [
  "ARCHITECTURE",
  "MATERIAL",
  "LIGHT",
  "MOVEMENT",
  "OPERATIONS",
] as const;

export const environmentCopy =
  "Every surface, threshold, sightline, sound, and operational decision belongs to the same act of authorship.";
