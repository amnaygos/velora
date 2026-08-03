export const PROJECT_CATEGORIES = [
  "Gyms & Fitness",
  "Spa & Wellness",
  "Hospitality",
  "Residential",
  "Dining & Lifestyle",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectMetric = {
  label: string;
  value: string;
};

/**
 * A same-camera transformation record: the space as found, and the space
 * as delivered, photographed from an identical position.
 */
export type Transformation = {
  /** Media asset id — the space as found. */
  before: string;
  /** Media asset id — the space as delivered. */
  after: string;
  /** What the room was before VELORA. */
  condition: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  area?: string;
  delivery?: string;
  services: string[];
  description: string;
  brief: string;
  response: string;
  outcome: string;
  metrics?: ProjectMetric[];
  /** Media asset id from the media registry. */
  heroMedia: string;
  /** Media asset ids from the media registry. */
  gallery: string[];
  /** Present when the project was photographed before and after. */
  transformation?: Transformation;
  featured?: boolean;
};
