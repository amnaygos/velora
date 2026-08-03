-- ============================================================
-- VELORA Admin — Database Schema
-- Applied automatically by `supabase start` / `supabase db reset`.
-- Seed data lives separately in supabase/seed.sql.
-- ============================================================

-- ---------- Enums ----------

do $$ begin
  create type enquiry_status as enum ('new', 'contacted', 'qualified', 'converted', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_stage as enum ('consultation', 'design', 'build', 'operations');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_category as enum ('gyms_fitness', 'spa_wellness', 'hospitality');
exception when duplicate_object then null; end $$;

do $$ begin
  create type milestone_status as enum ('done', 'due', 'planned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type calendar_event_type as enum ('site_visit', 'call', 'milestone', 'internal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type portfolio_status as enum ('published', 'draft');
exception when duplicate_object then null; end $$;

do $$ begin
  create type team_access as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type team_status as enum ('active', 'pending');
exception when duplicate_object then null; end $$;

-- ---------- Tables ----------

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  project_type text not null,
  budget_range text,
  source text,
  message text not null,
  status enquiry_status not null default 'new',
  internal_note text,
  converted_project_id uuid -- set once converted; FK added after projects table exists
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  category project_category not null default 'gyms_fitness',
  client_name text not null,
  client_email text,
  client_phone text,
  company text,
  project_type text,
  location text,
  budget_range text,
  budget_value numeric, -- numeric QAR value, used for pipeline totals
  stage project_stage not null default 'consultation',
  lead_principal text,
  designer text,
  area text,
  target_completion text,
  contract_type text,
  brief text,
  enquiry_id uuid references enquiries(id) on delete set null
);

alter table enquiries
  add constraint enquiries_converted_project_fk
  foreign key (converted_project_id) references projects(id) on delete set null;

create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status milestone_status not null default 'planned',
  event_date date,
  sort_order int not null default 0
);

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  event_type calendar_event_type not null default 'site_visit',
  event_date date not null,
  event_time text, -- e.g. "15:00 – 16:30"; kept as text for display flexibility
  project_id uuid references projects(id) on delete set null,
  attendees text,
  notes text
);

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  category text not null,
  location text,
  year text,
  before_image_url text,
  after_image_url text,
  status portfolio_status not null default 'draft',
  sort_order int not null default 0,
  project_id uuid references projects(id) on delete set null
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  role text,
  access team_access not null default 'viewer',
  status team_status not null default 'pending'
);

-- ---------- Indexes ----------

create index if not exists idx_enquiries_status on enquiries(status);
create index if not exists idx_projects_stage on projects(stage);
create index if not exists idx_milestones_project on project_milestones(project_id);
create index if not exists idx_events_date on calendar_events(event_date);
create index if not exists idx_portfolio_status on portfolio_items(status);

-- ---------- updated_at trigger for projects ----------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- Public (anon) role: may INSERT enquiries only (the live contact form).
-- Authenticated (signed-in admin) role: full read/write on everything.
-- ============================================================

alter table enquiries enable row level security;
alter table projects enable row level security;
alter table project_milestones enable row level security;
alter table calendar_events enable row level security;
alter table portfolio_items enable row level security;
alter table team_members enable row level security;

-- Public contact form can create an enquiry, nothing else.
drop policy if exists "public can submit enquiries" on enquiries;
create policy "public can submit enquiries"
  on enquiries for insert
  to anon
  with check (true);

-- Anyone (incl. anon) can read published portfolio items — the public /portfolio page uses this.
drop policy if exists "anyone can read published portfolio" on portfolio_items;
create policy "anyone can read published portfolio"
  on portfolio_items for select
  to anon
  using (status = 'published');

-- Authenticated admins: full access to every table.
drop policy if exists "authenticated full access" on enquiries;
create policy "authenticated full access" on enquiries for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on projects;
create policy "authenticated full access" on projects for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on project_milestones;
create policy "authenticated full access" on project_milestones for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on calendar_events;
create policy "authenticated full access" on calendar_events for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on portfolio_items;
create policy "authenticated full access" on portfolio_items for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on team_members;
create policy "authenticated full access" on team_members for all to authenticated using (true) with check (true);

-- ============================================================
-- Base table-level GRANTs
-- RLS policies control row visibility, but Postgres still requires the
-- underlying table-level privilege before a role can touch a table at all.
-- Hosted Supabase projects pre-configure this automatically for tables
-- created via the dashboard; a plain SQL migration (local CLI or a
-- self-run hosted SQL Editor script) does not get that for free, so it's
-- granted explicitly here for every table this app uses.
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
