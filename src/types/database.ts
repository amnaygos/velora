/**
 * Hand-written to match supabase/schema.sql. If the schema changes, update
 * this file (or replace with `supabase gen types typescript` output once
 * the Supabase CLI is linked to the project).
 */

export type EnquiryStatus = "new" | "contacted" | "qualified" | "converted" | "archived";
export type ProjectStage = "consultation" | "design" | "build" | "operations";
export type ProjectCategory = "gyms_fitness" | "spa_wellness" | "hospitality";
export type MilestoneStatus = "done" | "due" | "planned";
export type CalendarEventType = "site_visit" | "call" | "milestone" | "internal";
export type MediaPhase = "before" | "progress" | "after";
export type PortfolioStatus = "published" | "draft";
export type TeamAccess = "admin" | "editor" | "viewer";
export type TeamStatus = "active" | "pending";
/** Permission role that actually gates the app. */
export type AppRole = "manager" | "sales";

export interface Enquiry {
  id: string;
  created_at: string;
  // Nullable so the AI concierge can save a partial lead and enrich it later.
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  budget_range: string | null;
  source: string | null;
  message: string | null;
  status: EnquiryStatus;
  internal_note: string | null;
  converted_project_id: string | null;
  assigned_to: string | null;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: ProjectCategory;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  company: string | null;
  project_type: string | null;
  location: string | null;
  budget_range: string | null;
  budget_value: number | null;
  stage: ProjectStage;
  lead_principal: string | null;
  designer: string | null;
  area: string | null;
  target_completion: string | null;
  contract_type: string | null;
  brief: string | null;
  enquiry_id: string | null;
}

export interface ProjectMilestone {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  event_date: string | null;
  sort_order: number;
}

export interface ProjectMedia {
  id: string;
  created_at: string;
  project_id: string;
  /** Path inside the `project-media` Storage bucket, e.g. "<project_id>/<uuid>.jpg" */
  storage_path: string;
  phase: MediaPhase;
  caption: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface CalendarEvent {
  id: string;
  created_at: string;
  title: string;
  event_type: CalendarEventType;
  event_date: string;
  event_time: string | null;
  project_id: string | null;
  attendees: string | null;
  notes: string | null;
}

/**
 * A case study on the public site. Image fields hold either the id of a photo
 * already on the site (src/content/mediaRegistry.ts) or the public URL of a
 * photo uploaded from the admin — see parseMediaRef in src/lib/media.ts.
 */
export interface PortfolioItem {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  category: string;
  location: string | null;
  year: string | null;
  area: string | null;
  delivery: string | null;
  services: string[];
  description: string | null;
  brief: string | null;
  response: string | null;
  outcome: string | null;
  metrics: { label: string; value: string }[];
  hero_media: string | null;
  gallery: string[];
  /** The room as found and as delivered, photographed from one position. */
  before_media: string | null;
  after_media: string | null;
  before_condition: string | null;
  /** Shown in Selected Work on the home page. */
  featured: boolean;
  status: PortfolioStatus;
  sort_order: number;
  project_id: string | null;
}

export interface TestimonialRow {
  id: string;
  created_at: string;
  /** Each line break is a line break on the site. */
  quote: string;
  attribution: string;
  status: PortfolioStatus;
  sort_order: number;
}

export interface Subscriber {
  id: string;
  created_at: string;
  email: string;
  role: string | null;
  source: string | null;
}

export type Figure = { value: number; suffix: string; label: string };

export interface TeamMember {
  id: string;
  created_at: string;
  user_id: string | null;
  name: string;
  email: string;
  role: string | null;
  access: TeamAccess;
  status: TeamStatus;
  app_role: AppRole;
}

/** The single site_settings row: the public site's contact channels and studio details. */
export interface SiteSettings {
  id: true;
  chatbot_enabled: boolean;
  whatsapp_enabled: boolean;
  /** E.164, e.g. "+97455551234". */
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  contact_email: string | null;
  /** One entry per line of the address as printed on the site. */
  studio_address: string[];
  instagram_url: string | null;
  linkedin_url: string | null;
  /** The headline numbers on the About page. */
  figures: Figure[];
  updated_at: string;
}

export type ContactChannels = Pick<
  SiteSettings,
  "chatbot_enabled" | "whatsapp_enabled" | "whatsapp_number" | "whatsapp_message"
>;

export type StudioDetails = Pick<
  SiteSettings,
  "contact_email" | "studio_address" | "instagram_url" | "linkedin_url" | "figures"
>;

export interface Database {
  public: {
    Tables: {
      enquiries: { Row: Enquiry; Insert: Partial<Enquiry>; Update: Partial<Enquiry> };
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> };
      project_milestones: { Row: ProjectMilestone; Insert: Partial<ProjectMilestone>; Update: Partial<ProjectMilestone> };
      calendar_events: { Row: CalendarEvent; Insert: Partial<CalendarEvent>; Update: Partial<CalendarEvent> };
      portfolio_items: { Row: PortfolioItem; Insert: Partial<PortfolioItem>; Update: Partial<PortfolioItem> };
      team_members: { Row: TeamMember; Insert: Partial<TeamMember>; Update: Partial<TeamMember> };
      site_settings: { Row: SiteSettings; Insert: Partial<SiteSettings>; Update: Partial<SiteSettings> };
      testimonials: { Row: TestimonialRow; Insert: Partial<TestimonialRow>; Update: Partial<TestimonialRow> };
      subscribers: { Row: Subscriber; Insert: Partial<Subscriber>; Update: Partial<Subscriber> };
    };
  };
}
