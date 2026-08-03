-- ============================================================
-- Project media — photo galleries per project.
-- Files live in the `project-media` Storage bucket; this table
-- holds the metadata (phase, caption, order, which one is cover).
-- ============================================================

do $$ begin
  create type media_phase as enum ('before', 'progress', 'after');
exception when duplicate_object then null; end $$;

create table if not exists project_media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id) on delete cascade,
  -- Path inside the `project-media` bucket, e.g. "<project_id>/<uuid>.jpg".
  storage_path text not null,
  phase media_phase not null default 'progress',
  caption text,
  sort_order int not null default 0,
  is_cover boolean not null default false
);

create index if not exists idx_project_media_project on project_media(project_id);
create index if not exists idx_project_media_cover on project_media(project_id) where is_cover;

-- At most one cover per project. Enforced in the DB so a race between two
-- admins clicking "set cover" can't leave a project with two covers.
create unique index if not exists uniq_project_media_one_cover
  on project_media(project_id) where is_cover;

alter table project_media enable row level security;

drop policy if exists "authenticated full access" on project_media;
create policy "authenticated full access" on project_media
  for all to authenticated using (true) with check (true);

-- The public site may eventually show project photos; allow anon read.
drop policy if exists "anyone can read project media" on project_media;
create policy "anyone can read project media" on project_media
  for select to anon using (true);

grant select on project_media to anon;
grant select, insert, update, delete on project_media to authenticated, service_role;

-- ---------- Storage bucket ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,                                   -- public read: images are served straight from Storage
  10485760,                               -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view images in this bucket (it's public).
drop policy if exists "public read project-media" on storage.objects;
create policy "public read project-media" on storage.objects
  for select to public
  using (bucket_id = 'project-media');

-- Only signed-in admins can upload / replace / remove them.
drop policy if exists "authenticated upload project-media" on storage.objects;
create policy "authenticated upload project-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-media');

drop policy if exists "authenticated update project-media" on storage.objects;
create policy "authenticated update project-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-media');

drop policy if exists "authenticated delete project-media" on storage.objects;
create policy "authenticated delete project-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-media');
