/**
 * The three things VELORA builds for. Private homes and residential work
 * is the lead — most of what the studio does — with commercial /
 * hospitality and business consultancy alongside it.
 */
export type Pillar = {
  /** Heading lines. */
  title: string[];
  href: string;
  transitionLabel: string;
  blurb: string;
};

export const pillarLead: Pillar = {
  title: ["PRIVATE", "& RESIDENTIAL"],
  href: "/portfolio",
  transitionLabel: "VELORA — PORTFOLIO",
  blurb:
    "Family villas, private suites, home gyms and pools — the majority of our work, authored at every scale from a single spare room upward.",
};

export const pillarsSecondary: Pillar[] = [
  {
    title: ["COMMERCIAL", "& HOSPITALITY"],
    href: "/portfolio",
    transitionLabel: "VELORA — PORTFOLIO",
    blurb: "Clubs, hotel wellness floors, and developer amenities.",
  },
  {
    title: ["BUSINESS", "CONSULTANCY"],
    href: "/consultancy",
    transitionLabel: "VELORA — CONSULTANCY",
    blurb: "Advisory for operators who already run wellness spaces.",
  },
];

export const pillars: Pillar[] = [pillarLead, ...pillarsSecondary];
