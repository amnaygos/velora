-- ============================================================
-- Site settings: the switches a manager flips from /admin/settings
-- without a deploy — the AI concierge and the WhatsApp button on the
-- public site.
--
-- One row only. Anyone may READ it (the public site renders from it);
-- only managers may change it. The AI concierge ships switched OFF.
-- ============================================================

create table if not exists site_settings (
  -- Singleton: the key can only ever be TRUE, so there is exactly one row.
  id               boolean primary key default true check (id),
  chatbot_enabled  boolean not null default false,
  whatsapp_enabled boolean not null default false,
  -- E.164, e.g. +97455551234 (normalised by the admin action).
  whatsapp_number  text,
  -- Optional text pre-filled in the visitor's WhatsApp composer.
  whatsapp_message text,
  updated_at       timestamptz not null default now(),
  constraint whatsapp_needs_number
    check (not whatsapp_enabled or whatsapp_number is not null)
);

insert into site_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

drop policy if exists "anyone can read site settings" on site_settings;
create policy "anyone can read site settings" on site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "site settings manager only" on site_settings;
create policy "site settings manager only" on site_settings
  for update to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');
