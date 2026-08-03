import type {
  AssessmentQuestion,
  AssessmentResult,
} from "@/types/content";

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "projectType",
    eyebrow: "01 / 03",
    title: "WHAT ARE YOU CREATING?",
    options: [
      { value: "private-residence", label: "Private residence" },
      { value: "commercial-gym", label: "Commercial gym" },
      { value: "hospitality", label: "Hospitality" },
      { value: "corporate-wellness", label: "Corporate wellness" },
      { value: "spa-recovery", label: "Spa and recovery" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "vision",
    eyebrow: "02 / 03",
    title: "WHAT SHOULD THE SPACE SERVE?",
    options: [
      { value: "performance", label: "Performance" },
      { value: "recovery", label: "Recovery" },
      { value: "longevity", label: "Longevity" },
      { value: "hospitality", label: "Hospitality" },
      { value: "community", label: "Community" },
      { value: "private-retreat", label: "Private retreat" },
    ],
  },
  {
    id: "scale",
    eyebrow: "03 / 03",
    title: "AT WHAT SCALE?",
    options: [
      { value: "under-100", label: "Under 100 SQM" },
      { value: "100-250", label: "100–250 SQM" },
      { value: "250-500", label: "250–500 SQM" },
      { value: "500-1000", label: "500–1,000 SQM" },
      { value: "1000-plus", label: "1,000+ SQM" },
    ],
  },
];

/** Canonical service order, used to sort recommendations. */
const SERVICE_ORDER = [
  "CONSULTATION",
  "ARCHITECTURAL DESIGN",
  "COMMERCIAL & RESIDENTIAL WELLNESS",
  "HOSPITALITY WELLNESS",
  "EQUIPMENT & SUPPLY",
  "OPERATIONS & MANAGEMENT",
  "PROJECT SUPERVISION",
  "BUSINESS CONSULTING",
];

const TYPE_DISCIPLINES: Record<string, string[]> = {
  "private-residence": ["COMMERCIAL & RESIDENTIAL WELLNESS", "EQUIPMENT & SUPPLY"],
  "commercial-gym": [
    "COMMERCIAL & RESIDENTIAL WELLNESS",
    "EQUIPMENT & SUPPLY",
    "BUSINESS CONSULTING",
  ],
  hospitality: ["HOSPITALITY WELLNESS", "OPERATIONS & MANAGEMENT"],
  "corporate-wellness": [
    "COMMERCIAL & RESIDENTIAL WELLNESS",
    "OPERATIONS & MANAGEMENT",
  ],
  "spa-recovery": ["HOSPITALITY WELLNESS", "EQUIPMENT & SUPPLY"],
  other: ["COMMERCIAL & RESIDENTIAL WELLNESS"],
};

const VISION_DISCIPLINES: Record<string, string[]> = {
  performance: ["EQUIPMENT & SUPPLY"],
  recovery: ["EQUIPMENT & SUPPLY"],
  longevity: ["OPERATIONS & MANAGEMENT"],
  hospitality: ["HOSPITALITY WELLNESS"],
  community: ["OPERATIONS & MANAGEMENT", "BUSINESS CONSULTING"],
  "private-retreat": [],
};

const VISION_HEADLINES: Record<string, string> = {
  performance: "AN ENVIRONMENT BUILT FOR PERFORMANCE.",
  recovery: "AN ENVIRONMENT BUILT FOR RECOVERY.",
  longevity: "AN ENVIRONMENT BUILT FOR LONGEVITY.",
  hospitality: "AN ENVIRONMENT BUILT FOR HOSPITALITY.",
  community: "AN ENVIRONMENT BUILT FOR COMMUNITY.",
  "private-retreat": "A PRIVATE RETREAT, AUTHORED END TO END.",
};

const TYPE_LABELS: Record<string, string> = {
  "private-residence": "a private residence",
  "commercial-gym": "a commercial gym",
  hospitality: "a hospitality environment",
  "corporate-wellness": "a corporate wellness facility",
  "spa-recovery": "a spa and recovery environment",
  other: "your project",
};

const SCALE_LABELS: Record<string, string> = {
  "under-100": "under 100 SQM",
  "100-250": "100–250 SQM",
  "250-500": "250–500 SQM",
  "500-1000": "500–1,000 SQM",
  "1000-plus": "over 1,000 SQM",
};

/**
 * Deterministic, local-only assessment. Answers are never stored or sent
 * anywhere — the recommendation is computed in the browser from these rules.
 */
export function computeAssessment(
  projectType: string,
  vision: string,
  scale: string,
): AssessmentResult {
  const disciplines = new Set<string>([
    "CONSULTATION",
    "ARCHITECTURAL DESIGN",
    "PROJECT SUPERVISION",
  ]);

  for (const d of TYPE_DISCIPLINES[projectType] ?? []) disciplines.add(d);
  for (const d of VISION_DISCIPLINES[vision] ?? []) disciplines.add(d);
  if (scale === "500-1000" || scale === "1000-plus") {
    disciplines.add("OPERATIONS & MANAGEMENT");
  }
  if (scale === "1000-plus") {
    disciplines.add("BUSINESS CONSULTING");
  }

  const ordered = SERVICE_ORDER.filter((s) => disciplines.has(s));

  return {
    headline: VISION_HEADLINES[vision] ?? "AN ENVIRONMENT WORTH AUTHORING.",
    explanation: `For ${TYPE_LABELS[projectType] ?? "your project"} at ${
      SCALE_LABELS[scale] ?? "this scale"
    }, VELORA would act as a single author across ${ordered.length} disciplines — from the first strategic conversation through delivery${
      disciplines.has("OPERATIONS & MANAGEMENT")
        ? " and into long-term operation"
        : ""
    }.`,
    disciplines: ordered,
  };
}
