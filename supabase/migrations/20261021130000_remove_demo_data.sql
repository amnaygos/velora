-- ============================================================
-- Remove the demo records that seed.sql used to load, so the admin
-- shows only real work. Each delete matches the exact demo values, so
-- anything entered through the site or the admin is untouched.
-- (The website content that replaces the demo portfolio ships in the
-- next migration.)
-- ============================================================

delete from enquiries
where email in (
  'khalid@emadi-group.qa', 'sara.mannai@icloud.com', 'f.attiyah@qatarwellness.qa',
  'mj@jaberholdings.com', 'noor@alkuwari.qa', 'hamad.sada@gmail.com',
  'a.thani@royalestates.qa', 'yousef@misnad.qa'
);

delete from calendar_events
where title in (
  'Site visit — Grand Training Hall', 'Sign-off — Aqua Training Pavilion',
  'Spec approval — Cedar Recovery Spa', 'Discovery call — K. Al Emadi',
  'Render review — Nightfall Lap Pool', 'Proposal follow-up — Obsidian'
);

-- Milestones and media rows go with their project (on delete cascade).
delete from projects
where (name, client_name) in (
  ('Aqua Training Pavilion', 'Khalid Al Emadi'),
  ('Cedar Recovery Spa', 'Al Sada Family'),
  ('Grand Training Hall', 'Al Thani Estates'),
  ('Nightfall Lap Pool', 'Al Mannai'),
  ('Villa Fitness Suite', 'Nasser bin Khaled'),
  ('Obsidian Performance Studio', 'Al Kuwari'),
  ('The Yoga Alcove', 'Al Misnad'),
  ('Emerald Fitness Club', 'Al Emadi')
);

-- The demo portfolio pointed at the old /Portfolio/ image set.
delete from portfolio_items
where slug in (
  'grand-training-hall', 'villa-fitness-suite', 'obsidian-performance-studio',
  'aqua-training-pavilion', 'emerald-fitness-club', 'nightfall-lap-pool', 'the-yoga-alcove'
)
and before_image_url like '/Portfolio/%';

-- Roster names with no sign-in behind them.
delete from team_members
where user_id is null
  and email in ('rashid@velora.qa', 'layla@velora.qa', 'omar@velora.qa', 'sara@velora.qa');
