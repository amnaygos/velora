-- ============================================================
-- VELORA Admin — Seed data
-- Applied automatically after migrations by `supabase db reset`
-- (and on first `supabase start`). Mirrors the admin prototype so
-- the dashboard isn't empty on first login. Safe to edit freely.
-- ============================================================

insert into team_members (name, email, role, access, status) values
  ('Admin', 'admin@velora.qa', 'Principal', 'admin', 'active'),
  ('Rashid K.', 'rashid@velora.qa', 'Principal', 'admin', 'active'),
  ('Layla H.', 'layla@velora.qa', 'Designer', 'editor', 'active'),
  ('Omar T.', 'omar@velora.qa', 'Architect', 'editor', 'active'),
  ('Sara N.', 'sara@velora.qa', 'Coordinator', 'viewer', 'pending')
on conflict (email) do nothing;

insert into projects (name, category, client_name, company, project_type, location, budget_range, budget_value, stage, lead_principal, designer, area, target_completion, contract_type, brief)
values
  ('Aqua Training Pavilion', 'hospitality', 'Khalid Al Emadi', 'Emadi Group Hospitality', 'Hotel Fitness Centre', 'The Pearl, Qatar', 'QAR 5,000,000 +', 5500000, 'build', 'Rashid K.', 'Omar T.', '~900 m²', 'Q3 2027', 'Design–Build–Operate',
    'Five-star tower in The Pearl. Full fitness & recovery floor, ~900 m², dual sea view. Partner for design through operations.'),
  ('Cedar Recovery Spa', 'spa_wellness', 'Al Sada Family', null, 'Spa & Recovery Centre', 'Msheireb, Qatar', 'QAR 2,000,000 – 5,000,000', 2800000, 'build', 'Admin', 'Layla H.', '~420 m²', 'Q1 2027', 'Design–Build',
    'Private recovery spa for a family residence in Msheireb.'),
  ('Grand Training Hall', 'gyms_fitness', 'Al Thani Estates', null, 'Private Gym or Fitness Studio', 'Doha, Qatar', 'QAR 2,000,000 – 5,000,000', 2400000, 'build', 'Rashid K.', null, '~600 m²', 'Q4 2026', 'Design–Build',
    'Private training hall for a family estate.'),
  ('Nightfall Lap Pool', 'spa_wellness', 'Al Mannai', null, 'Spa & Recovery Centre', 'Lusail, Qatar', 'QAR 2,000,000 – 5,000,000', 4200000, 'design', 'Admin', 'Omar T.', '~380 m²', 'Q2 2027', 'Design–Build',
    'Indoor lap pool with recovery lounge, night-swim lighting concept.'),
  ('Villa Fitness Suite', 'gyms_fitness', 'Nasser bin Khaled', null, 'Residential Wellness Suite', 'The Pearl, Qatar', 'Under QAR 500,000', 850000, 'design', 'Admin', 'Layla H.', '~140 m²', 'Q4 2026', 'Design–Build',
    'Residential fitness suite, concept approved, entering documentation.'),
  ('Obsidian Performance Studio', 'gyms_fitness', 'Al Kuwari', null, 'Commercial Gym or Health Club', 'Lusail, Qatar', 'QAR 500,000 – 2,000,000', 1200000, 'consultation', 'Admin', null, null, 'TBD', null,
    'Commercial performance studio, proposal sent, awaiting reply.'),
  ('The Yoga Alcove', 'spa_wellness', 'Al Misnad', null, 'Residential Wellness Suite', 'Al Waab, Qatar', 'QAR 500,000 – 2,000,000', 420000, 'consultation', 'Rashid K.', 'Layla H.', null, 'TBD', null,
    'Small residential yoga and meditation room, brief under review.'),
  ('Emerald Fitness Club', 'gyms_fitness', 'Al Emadi', null, 'Commercial Gym or Health Club', 'West Bay, Qatar', 'QAR 2,000,000 – 5,000,000', 3100000, 'operations', 'Admin', null, '~750 m²', 'Live', 'Design–Build–Operate',
    'Commercial fitness club, handover complete, now under Velora operations management.');

-- Milestones for Aqua Training Pavilion (the one with a live overdue item)
-- Note: literal strings/dates in a UNION ALL resolve to `text` before the
-- enclosing INSERT can coerce them, so enum- and date-typed columns need an
-- explicit cast here (plain multi-row VALUES inserts don't have this issue).
insert into project_milestones (project_id, title, description, status, event_date, sort_order)
select id, 'Discovery & consultation', 'Brief confirmed — full recovery floor, 900 m², dual sea view. Scope: design → operations.', 'done'::milestone_status, '2026-03-12'::date, 1 from projects where name = 'Aqua Training Pavilion'
union all
select id, 'Concept design approved', 'Client signed off on spatial layout and material palette. Moodboard archived.', 'done'::milestone_status, '2026-04-28'::date, 2 from projects where name = 'Aqua Training Pavilion'
union all
select id, 'Build commenced', 'Main contractor mobilised. Pool shell and structural works underway.', 'done'::milestone_status, '2026-06-02'::date, 3 from projects where name = 'Aqua Training Pavilion'
union all
select id, 'Contractor sign-off — overdue', 'Awaiting structural sign-off before finishes phase. Chase contractor today.', 'due'::milestone_status, '2026-07-11'::date, 4 from projects where name = 'Aqua Training Pavilion'
union all
select id, 'Handover & operations', 'Staff training, quality governance, soft launch.', 'planned'::milestone_status, '2027-09-01'::date, 5 from projects where name = 'Aqua Training Pavilion';

-- Calendar events
insert into calendar_events (title, event_type, event_date, event_time, project_id, attendees, notes)
select 'Site visit — Grand Training Hall', 'site_visit'::calendar_event_type, '2026-07-09'::date, '15:00 – 16:30', id, 'Rashid K., contractor, client', 'Walk the fit-out progress with the contractor. Confirm flooring delivery date.'
from projects where name = 'Grand Training Hall'
union all
select 'Sign-off — Aqua Training Pavilion', 'milestone'::calendar_event_type, '2026-07-11'::date, null, id, null, null from projects where name = 'Aqua Training Pavilion'
union all
select 'Spec approval — Cedar Recovery Spa', 'milestone'::calendar_event_type, '2026-07-12'::date, null, id, null, null from projects where name = 'Cedar Recovery Spa'
union all
select 'Discovery call — K. Al Emadi', 'call'::calendar_event_type, '2026-07-10'::date, '11:00', id, null, null from projects where name = 'Aqua Training Pavilion'
union all
select 'Render review — Nightfall Lap Pool', 'internal'::calendar_event_type, '2026-07-18'::date, null, id, null, null from projects where name = 'Nightfall Lap Pool'
union all
select 'Proposal follow-up — Obsidian', 'milestone'::calendar_event_type, '2026-07-15'::date, null, id, null, null from projects where name = 'Obsidian Performance Studio';

-- Portfolio (mirrors the live public /portfolio page)
insert into portfolio_items (name, slug, category, location, year, before_image_url, after_image_url, status, sort_order) values
  ('Grand Training Hall', 'grand-training-hall', 'GYMS & FITNESS', 'Doha, Qatar', '2025', '/Portfolio/BigroomGym-B.png', '/Portfolio/BigroomGym-A.png', 'published', 1),
  ('Villa Fitness Suite', 'villa-fitness-suite', 'GYMS & FITNESS', 'Doha, Qatar', '2024', '/Portfolio/Gym1-B.png', '/Portfolio/Gym1-A.png', 'published', 2),
  ('Obsidian Performance Studio', 'obsidian-performance-studio', 'GYMS & FITNESS', 'Lusail, Qatar', '2025', '/Portfolio/dark-B.png', '/Portfolio/dark-A.png', 'published', 3),
  ('Aqua Training Pavilion', 'aqua-training-pavilion', 'GYMS & FITNESS', 'The Pearl, Qatar', '2024', '/Portfolio/Gym2-B.png', '/Portfolio/Gym2-A.png', 'published', 4),
  ('Emerald Fitness Club', 'emerald-fitness-club', 'GYMS & FITNESS', 'West Bay, Qatar', '2023', '/Portfolio/gym3-B.png', '/Portfolio/gym3-A.png', 'published', 5),
  ('Nightfall Lap Pool', 'nightfall-lap-pool', 'SPA & WELLNESS', 'Lusail, Qatar', '2024', '/Portfolio/pool-B.png', '/Portfolio/pool-A.png', 'published', 6),
  ('The Yoga Alcove', 'the-yoga-alcove', 'SPA & WELLNESS', 'Al Waab, Qatar', '2023', '/Portfolio/small yoga room-B.png', '/Portfolio/small yoga room-A.png', 'draft', 7)
on conflict (slug) do nothing;

-- Sample enquiries (the live inbox)
insert into enquiries (name, email, phone, company, project_type, budget_range, source, message, status, internal_note) values
  ('Khalid Al Emadi', 'khalid@emadi-group.qa', '+974 5512 8890', 'Emadi Group Hospitality', 'Hotel Fitness Centre', 'QAR 5,000,000 +', 'Referral',
   'We''re opening a five-star tower in Lusail Marina next year and want a signature fitness & recovery floor that competes with anything in the region. Full floor, roughly 900 m², sea views on two sides. Looking for a partner who can handle design through operations — not just supply equipment.',
   'new', 'Referred by A. Al Thani (Royal Estates). High intent — wants a call this week. Assign to principals.'),
  ('Sara Al Mannai', 'sara.mannai@icloud.com', null, null, 'Residential Wellness Suite', 'QAR 500,000 – 2,000,000', 'Instagram',
   'Looking to convert a spare room into a proper wellness suite — sauna, cold plunge, small gym area.', 'new', null),
  ('Fatima Al Attiyah', 'f.attiyah@qatarwellness.qa', null, 'Qatar Wellness Group', 'Spa & Recovery Centre', 'QAR 2,000,000 – 5,000,000', 'LinkedIn',
   'Expanding our wellness group with a dedicated recovery centre. Would like to discuss scope and timeline.', 'new', null),
  ('Mohammed Al Jaber', 'mj@jaberholdings.com', null, 'Jaber Holdings', 'Commercial Gym or Health Club', null, 'Direct Search',
   'Interested in a full commercial gym build-out for a new retail development.', 'new', null),
  ('Noor Al Kuwari', 'noor@alkuwari.qa', null, null, 'Private Gym or Fitness Studio', 'QAR 500,000 – 2,000,000', 'Referral',
   'Private gym for a family residence, referred by a past client.', 'contacted', null),
  ('Hamad Al Sada', 'hamad.sada@gmail.com', null, null, 'Corporate Wellness Facility', 'QAR 2,000,000 – 5,000,000', 'LinkedIn',
   'Corporate wellness facility for our new HQ campus.', 'contacted', null),
  ('Aisha Al Thani', 'a.thani@royalestates.qa', null, 'Royal Estates', 'Hotel Fitness Centre', 'QAR 5,000,000 +', 'Referral',
   'Hotel fitness centre for a new property in West Bay.', 'qualified', null),
  ('Yousef Al Misnad', 'yousef@misnad.qa', null, null, 'Residential Wellness Suite', 'QAR 500,000 – 2,000,000', 'Instagram',
   'Residential wellness suite enquiry.', 'converted', null);

-- Link the converted enquiry to its project, and the project back to the enquiry (both directions)
update enquiries set converted_project_id = (select id from projects where name = 'The Yoga Alcove')
where email = 'yousef@misnad.qa';

update projects set enquiry_id = (select id from enquiries where email = 'yousef@misnad.qa')
where name = 'The Yoga Alcove';
