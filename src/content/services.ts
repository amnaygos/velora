import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    index: "01",
    discipline: "STRATEGY",
    title: "CONSULTATION",
    summary:
      "Wellness goals, programming, equipment intelligence, and integration strategy before the first line is drawn.",
    detail:
      "Every environment begins as a set of questions. Who moves through this space, and why. What should the first thirty seconds feel like. What must still be true in ten years. VELORA resolves these questions into a precise strategic brief before design begins, so that every later decision has something to answer to.",
    scope: [
      "Wellness programming and concept definition",
      "Equipment intelligence and specification strategy",
      "Spatial and operational feasibility",
      "Investment framing and phasing",
    ],
    mediaId: "still-environment",
  },
  {
    index: "02",
    discipline: "DESIGN",
    title: "ARCHITECTURAL DESIGN",
    summary:
      "Site, flow, material, light, and construction oversight treated as one continuous act of authorship.",
    detail:
      "Design at VELORA is not decoration applied to a plan. Circulation, proportion, material, acoustics, and light are composed together, and the construction documents carry that intent without dilution. The drawing set is the argument; the finished space is its proof.",
    scope: [
      "Concept and spatial design",
      "Material and lighting language",
      "Technical documentation",
      "Design authorship through construction",
    ],
    mediaId: "video-design-process",
  },
  {
    index: "03",
    discipline: "DEVELOPMENT",
    title: "COMMERCIAL & RESIDENTIAL WELLNESS",
    summary:
      "Spaces created to sustain engagement with wellbeing rather than simply satisfy a specification.",
    detail:
      "A commercial floor and a private suite ask different questions, but they share one measure: whether people return. VELORA develops wellness environments that hold attention over years — spaces whose atmosphere, sequence, and detail keep the practice alive long after the opening.",
    scope: [
      "Commercial fitness and wellness clubs",
      "Private residential gyms and suites",
      "Developer amenity environments",
      "Corporate wellness facilities",
    ],
    mediaId: "portfolio-lusail-performance-club",
  },
  {
    index: "04",
    discipline: "HOSPITALITY",
    title: "HOSPITALITY WELLNESS",
    summary:
      "Luxury and functionality resolved into one complete operational experience.",
    detail:
      "In hospitality, the wellness floor is where a brand's promise is tested physically. VELORA designs and delivers hotel wellness environments in which guest experience, service choreography, and back-of-house precision belong to the same drawing — so the calm the guest feels is structural, not staged.",
    scope: [
      "Hotel spa and wellness floors",
      "Pool and thermal environments",
      "Guest journey and service choreography",
      "Brand-aligned wellness standards",
    ],
    mediaId: "video-hospitality",
  },
  {
    index: "05",
    discipline: "PRODUCT",
    title: "EQUIPMENT & SUPPLY",
    summary:
      "Bespoke equipment, considered integration, and access to selected premium product lines.",
    detail:
      "Equipment is architecture at hand scale. VELORA specifies, sources, and integrates premium lines — and commissions bespoke pieces where the standard catalogue falls short — so that what the hand touches carries the same intent as the room around it.",
    scope: [
      "Premium equipment curation",
      "Bespoke equipment commissions",
      "Integration and installation",
      "Lifecycle and refresh planning",
    ],
    mediaId: "detail-grand-training-hall",
  },
  {
    index: "06",
    discipline: "CONTINUITY",
    title: "OPERATIONS & MANAGEMENT",
    summary: "A space is only as exceptional as how it runs on day 1,001.",
    detail:
      "Handover is not the end of authorship. VELORA remains engaged through operating standards, staff training, maintenance discipline, and periodic refinement — protecting the original idea against the slow erosion of daily use.",
    scope: [
      "Operating standards and playbooks",
      "Staffing and training frameworks",
      "Preventive maintenance programmes",
      "Ongoing performance review",
    ],
    mediaId: "video-day-1001",
  },
  {
    index: "07",
    discipline: "PRECISION",
    title: "PROJECT SUPERVISION",
    summary:
      "Time, budget, detail, and the original design intent protected through delivery.",
    detail:
      "Between drawing and reality stands construction — where most environments quietly lose their intent. VELORA supervises delivery with the same care applied to design: sequencing, tolerances, samples, and site decisions all measured against the original idea.",
    scope: [
      "Construction supervision",
      "Cost and programme control",
      "Quality and tolerance management",
      "Design intent protection",
    ],
    mediaId: "video-build-precision",
  },
  {
    index: "08",
    discipline: "GROWTH",
    title: "BUSINESS CONSULTING",
    summary:
      "Evaluation, strategic roadmaps, and long-term advisory for established wellness operators.",
    detail:
      "For operators with existing spaces, VELORA acts as a quiet advisor: evaluating performance, identifying where environment and operation diverge, and shaping roadmaps that compound — because the best wellness businesses are built deliberately, year over year.",
    scope: [
      "Operational and spatial audits",
      "Repositioning and refresh strategy",
      "Expansion roadmaps",
      "Long-term advisory",
    ],
    mediaId: "portfolio-city-performance-floor",
  },
];

export const lifecycleWords = [
  "CONSULT",
  "DESIGN",
  "BUILD",
  "OPERATE",
  "SUSTAIN",
] as const;

export const servicesClosing = {
  lines: ["ONE PARTNER.", "FROM FIRST QUESTION", "TO DAY 1,001."],
  cta: "DISCUSS YOUR PROJECT",
};
