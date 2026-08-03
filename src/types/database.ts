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

export interface PortfolioItem {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  category: string;
  location: string | null;
  year: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  status: PortfolioStatus;
  sort_order: number;
  project_id: string | null;
}

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

export interface Database {
  public: {
    Tables: {
      enquiries: { Row: Enquiry; Insert: Partial<Enquiry>; Update: Partial<Enquiry> };
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> };
      project_milestones: { Row: ProjectMilestone; Insert: Partial<ProjectMilestone>; Update: Partial<ProjectMilestone> };
      calendar_events: { Row: CalendarEvent; Insert: Partial<CalendarEvent>; Update: Partial<CalendarEvent> };
      portfolio_items: { Row: PortfolioItem; Insert: Partial<PortfolioItem>; Update: Partial<PortfolioItem> };
      team_members: { Row: TeamMember; Insert: Partial<TeamMember>; Update: Partial<TeamMember> };
    };
  };
}
