-- ============================================================
-- Role-based access control (RBAC): managers vs sales.
--
--   manager — full access to everything (the studio principals).
--   sales   — enquiries only. No projects, calendar, portfolio, media,
--             or team management.
--
-- Enforcement is defence-in-depth:
--   1. This file — RLS at the database, keyed off the signed-in user's
--      JWT app_metadata.app_role (so even a raw API call is restricted).
--   2. Next.js middleware — routes a sales user away from everything but
--      /admin/enquiries.
--   3. The sidebar — only renders links the role may use.
--
-- The public marketing site has been removed, so the old anon policies
-- (public enquiry submission, public portfolio read) are dropped here.
-- ============================================================

do $$ begin
  create type app_role as enum ('manager', 'sales');
exception when duplicate_object then null; end $$;

alter table team_members
  add column if not exists app_role app_role not null default 'manager';

-- Sales can own/work an enquiry.
alter table enquiries
  add column if not exists assigned_to uuid references team_members(id) on delete set null;

create index if not exists idx_enquiries_assigned on enquiries(assigned_to);

-- ---------- Role helper ----------
-- Reads the role straight from the JWT (app_metadata is a top-level claim),
-- so it needs no table lookup and can't recurse into team_members' own RLS.
create or replace function public.jwt_app_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'app_role', 'none');
$$;

grant execute on function public.jwt_app_role() to anon, authenticated, service_role;

-- ============================================================
-- Replace the blanket "authenticated full access" policies with
-- role-scoped ones.
-- ============================================================

-- ---- enquiries: managers + sales ----
drop policy if exists "authenticated full access" on enquiries;
drop policy if exists "public can submit enquiries" on enquiries;      -- public site gone
drop policy if exists "enquiries manager or sales" on enquiries;
create policy "enquiries manager or sales" on enquiries
  for all to authenticated
  using (public.jwt_app_role() in ('manager', 'sales'))
  with check (public.jwt_app_role() in ('manager', 'sales'));

-- ---- projects & everything project-related: managers only ----
drop policy if exists "authenticated full access" on projects;
drop policy if exists "projects manager only" on projects;
create policy "projects manager only" on projects
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

drop policy if exists "authenticated full access" on project_milestones;
drop policy if exists "milestones manager only" on project_milestones;
create policy "milestones manager only" on project_milestones
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

drop policy if exists "authenticated full access" on project_media;
drop policy if exists "anyone can read project media" on project_media;  -- public site gone
drop policy if exists "media manager only" on project_media;
create policy "media manager only" on project_media
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

drop policy if exists "authenticated full access" on calendar_events;
drop policy if exists "calendar manager only" on calendar_events;
create policy "calendar manager only" on calendar_events
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

drop policy if exists "authenticated full access" on portfolio_items;
drop policy if exists "anyone can read published portfolio" on portfolio_items;  -- public site gone
drop policy if exists "portfolio manager only" on portfolio_items;
create policy "portfolio manager only" on portfolio_items
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

-- ---- team_members: managers manage everyone; any signed-in user may READ
--      the roster (needed to resolve enquiry-assignee names and populate the
--      assignment dropdown). Writes stay manager-only. ----
drop policy if exists "authenticated full access" on team_members;
drop policy if exists "team manager full" on team_members;
drop policy if exists "team read own row" on team_members;
drop policy if exists "team read all" on team_members;
create policy "team manager full" on team_members
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');
create policy "team read all" on team_members
  for select to authenticated
  using (true);

-- ---- storage: keep images publicly readable (admin <img> serves them
--      straight from the public bucket), but only managers may write. ----
drop policy if exists "authenticated upload project-media" on storage.objects;
create policy "manager upload project-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-media' and public.jwt_app_role() = 'manager');

drop policy if exists "authenticated update project-media" on storage.objects;
create policy "manager update project-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-media' and public.jwt_app_role() = 'manager');

drop policy if exists "authenticated delete project-media" on storage.objects;
create policy "manager delete project-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-media' and public.jwt_app_role() = 'manager');

-- Make the seeded roster explicit: everyone currently seeded is a manager;
-- the sales seat is created by seed-users.mjs.
update team_members set app_role = 'manager' where app_role is null;
