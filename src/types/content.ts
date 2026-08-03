export type NavItem = {
  label: string;
  href: string;
  /** Label shown by the route transition overlay, e.g. "VELORA — ABOUT". */
  transitionLabel: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type CredentialStat = {
  value: number;
  suffix: string;
  label: string;
};

export type Service = {
  index: string;
  discipline: string;
  title: string;
  summary: string;
  detail: string;
  scope: string[];
  /** Media asset id from the media registry. */
  mediaId: string;
};

export type Testimonial = {
  quoteLines: string[];
  attribution: string;
};

export type AssessmentOption = {
  value: string;
  label: string;
};

export type AssessmentQuestion = {
  id: "projectType" | "vision" | "scale";
  eyebrow: string;
  title: string;
  options: AssessmentOption[];
};

export type AssessmentResult = {
  headline: string;
  explanation: string;
  disciplines: string[];
};
