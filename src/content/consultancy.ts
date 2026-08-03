export type ConsultancyItem = {
  index: string;
  title: string;
  copy: string;
};

export const consultancy = {
  eyebrow: "VELORA — BUSINESS CONSULTANCY",
  heroLines: ["INTELLIGENCE FOR THOSE", "WHO ALREADY OPERATE."],
  intro:
    "Not every engagement begins with a drawing. For operators who already run a wellness space, VELORA acts as a quiet advisor — reading the distance between how a space was meant to perform and how it performs today, and shaping the plan that closes it.",

  offerEyebrow: "WHAT IT COVERS",
  offers: [
    {
      index: "01",
      title: "OPERATIONAL AUDIT",
      copy: "A clear, unsentimental reading of how the space runs against how it was meant to — utilisation, flow, maintenance discipline, and the daily details that quietly erode.",
    },
    {
      index: "02",
      title: "ENVIRONMENT REVIEW",
      copy: "Where the architecture and the operation have drifted apart: sightlines that no longer hold, lighting that no longer serves, materials asked to do the wrong work.",
    },
    {
      index: "03",
      title: "STRATEGIC ROADMAP",
      copy: "A sequenced plan of interventions — from same-week corrections to phased capital works — ordered so that the earliest moves fund and inform the later ones.",
    },
    {
      index: "04",
      title: "LONG-TERM ADVISORY",
      copy: "A retained relationship: periodic review, benchmarking, and a considered voice in the decisions that compound over years rather than quarters.",
    },
  ],

  processEyebrow: "HOW AN ENGAGEMENT RUNS",
  process: [
    {
      index: "01",
      title: "LISTEN",
      copy: "We begin with the business behind the space — what it is for, who it answers to, and what success actually looks like from the inside.",
    },
    {
      index: "02",
      title: "MEASURE",
      copy: "We audit the environment, the operation, and the numbers together, because the three are never separate and the truth sits where they meet.",
    },
    {
      index: "03",
      title: "DIAGNOSE",
      copy: "We name, precisely and without flattery, where intent and reality have diverged — and what it is costing.",
    },
    {
      index: "04",
      title: "ROADMAP",
      copy: "We deliver a phased plan with clear priorities, honest sequencing, and a defined role for VELORA at each stage — or none.",
    },
  ],

  audienceEyebrow: "FOR WHOM",
  audience: [
    "Established gyms and health clubs",
    "Hotel groups and hospitality operators",
    "Property developers with amenity portfolios",
    "Private operators of wellness and recovery spaces",
  ],

  statement: {
    lines: ["THE BEST WELLNESS BUSINESSES", "ARE BUILT DELIBERATELY."],
    body: "Year over year, decision over decision. VELORA brings two decades of that deliberation to spaces we did not design — and often to ones we did.",
  },

  cta: {
    lines: ["ALREADY OPERATING?", "LET US LOOK CLOSELY."],
    action: "REQUEST A CONSULTATION",
  },
} as const;
