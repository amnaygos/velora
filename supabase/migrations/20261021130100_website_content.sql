-- ============================================================
-- The public website reads its content from here, and managers edit it
-- in the admin: case studies (portfolio_items), testimonials, and the
-- studio details on site_settings. Visitors' Blueprint requests and
-- newsletter sign-ups are stored too (subscribers).
--
-- Anyone may READ what is published; only managers may change it.
-- Visitors may only INSERT a subscription, never read one back.
-- ============================================================

-- ---------- Case studies ----------
-- An image field holds either the id of a photo already on the site
-- (public/media, see src/content/mediaRegistry.ts) or the public URL of a
-- photo uploaded from the admin.
alter table portfolio_items rename column before_image_url to before_media;
alter table portfolio_items rename column after_image_url to after_media;

alter table portfolio_items
  add column if not exists updated_at       timestamptz not null default now(),
  add column if not exists area             text,
  add column if not exists delivery         text,
  add column if not exists services         text[] not null default '{}',
  add column if not exists description      text,
  add column if not exists brief            text,
  add column if not exists response         text,
  add column if not exists outcome          text,
  add column if not exists metrics          jsonb not null default '[]',  -- [{label, value}]
  add column if not exists hero_media       text,
  add column if not exists gallery          text[] not null default '{}',
  add column if not exists before_condition text,                           -- the room as found
  add column if not exists featured         boolean not null default false; -- shown in Selected Work

drop trigger if exists trg_portfolio_items_updated_at on portfolio_items;
create trigger trg_portfolio_items_updated_at
  before update on portfolio_items
  for each row execute function set_updated_at();

drop policy if exists "anyone can read published portfolio" on portfolio_items;
create policy "anyone can read published portfolio" on portfolio_items
  for select to anon, authenticated
  using (status = 'published');

grant select on portfolio_items to anon;

-- ---------- Testimonials ----------
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  quote       text not null,  -- each line break is a line break on the site
  attribution text not null,
  status      portfolio_status not null default 'published',
  sort_order  int not null default 0
);

alter table testimonials enable row level security;

drop policy if exists "anyone can read published testimonials" on testimonials;
create policy "anyone can read published testimonials" on testimonials
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "testimonials manager only" on testimonials;
create policy "testimonials manager only" on testimonials
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

grant select on testimonials to anon;
grant select, insert, update, delete on testimonials to authenticated, service_role;

-- ---------- Studio details ----------
alter table site_settings
  add column if not exists contact_email  text,
  add column if not exists studio_address text[] not null default '{}',
  add column if not exists instagram_url  text,
  add column if not exists linkedin_url   text,
  add column if not exists figures        jsonb not null default '[]';  -- [{value, suffix, label}]

-- ---------- Newsletter subscribers ----------
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null,
  role       text,
  source     text
);

create unique index if not exists uniq_subscribers_email on subscribers (lower(email));

alter table subscribers enable row level security;

drop policy if exists "public can subscribe" on subscribers;
create policy "public can subscribe" on subscribers
  for insert to anon
  with check (true);

drop policy if exists "subscribers manager only" on subscribers;
create policy "subscribers manager only" on subscribers
  for all to authenticated
  using (public.jwt_app_role() = 'manager')
  with check (public.jwt_app_role() = 'manager');

grant insert on subscribers to anon;
grant select, insert, update, delete on subscribers to authenticated, service_role;

-- ---------- Photos uploaded from the admin ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "manager list site-media" on storage.objects;
create policy "manager list site-media" on storage.objects
  for select to authenticated
  using (bucket_id = 'site-media' and public.jwt_app_role() = 'manager');

drop policy if exists "manager upload site-media" on storage.objects;
create policy "manager upload site-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-media' and public.jwt_app_role() = 'manager');

drop policy if exists "manager update site-media" on storage.objects;
create policy "manager update site-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and public.jwt_app_role() = 'manager');

drop policy if exists "manager delete site-media" on storage.objects;
create policy "manager delete site-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and public.jwt_app_role() = 'manager');

-- ============================================================
-- The content that was hardcoded in src/content until now.
-- ============================================================

insert into portfolio_items
  (slug, name, category, location, year, area, delivery, services, description, brief, response, outcome, metrics, hero_media, gallery, before_media, after_media, before_condition, featured, status, sort_order)
values
  ('grand-training-hall', 'GRAND TRAINING HALL', 'Gyms & Fitness', 'WEST BAY, DOHA', '2024', '420 SQM', 'DELIVERED IN FIVE MONTHS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'PROJECT SUPERVISION']::text[], 'A 420 SQM training hall for a West Bay residential tower, composed as one continuous environment for elite athletes and everyday residents alike.', 'A residential tower handed over its amenity floor as a bare concrete shell. The brief was to create a training environment capable of supporting serious athletes and everyday residents without dividing the space into separate visual identities.', 'Raw materials, engineered lighting, controlled circulation, and clearly defined training zones were composed as one continuous environment. Herringbone timber was laid the length of the hall to draw the eye through it. Lighting was treated as a performance tool rather than a decorative layer.', '420 SQM delivered in five months. The hall does not simply accommodate training — it changed how the building''s residents talk about the tower.', '[{"label":"AREA","value":"420 SQM"},{"label":"DELIVERY","value":"5 MONTHS"},{"label":"TRAINING ZONES","value":"5"}]'::jsonb, 'pair-grand-training-hall-after', array['extra-grand-training-hall', 'detail-grand-training-hall']::text[], 'pair-grand-training-hall-before', 'pair-grand-training-hall-after', 'A bare concrete shell: unfinished ceiling, exposed services, dust sheets across the slab.', true, 'published', 1),
  ('nightfall-lap-pool', 'NIGHTFALL LAP POOL', 'Residential', 'THE PEARL, DOHA', '2024', '260 SQM', 'DELIVERED IN SEVEN MONTHS', array['ARCHITECTURAL DESIGN', 'PROJECT SUPERVISION', 'OPERATIONS & MANAGEMENT']::text[], 'A private indoor lap pool on The Pearl, designed for one ritual: swimming alone, at night, in complete stillness.', 'The client swims at night, alone, as the last act of the day. The pool hall existed only as a poured concrete basin. It had to serve that single ritual — without echo, glare, or any sensation of a leisure facility.', 'The hall was treated as a dark instrument: honed stone absorbs sound and light, a continuous underwater line guides the swimmer, and the water arrives flush with the deck so the room reads as a single black plane. Plant and filtration were exiled beyond an acoustic threshold, and the courtyard was planted and lit so the glass gives back a garden rather than a reflection.', 'A 25-metre rhythm in total quiet. The client reports the pool has replaced the study as the place where the day resolves.', '[{"label":"LENGTH","value":"25 M"},{"label":"AREA","value":"260 SQM"},{"label":"ACOUSTIC LEVEL","value":"< 30 DB"}]'::jsonb, 'pair-nightfall-lap-pool-after', array['extra-nightfall-lap-pool', 'video-lap-pool', 'detail-nightfall-lap-pool']::text[], 'pair-nightfall-lap-pool-before', 'pair-nightfall-lap-pool-after', 'An empty concrete basin: scaffolding at the far wall, protective sheeting, stone yet to be set.', true, 'published', 2),
  ('the-yoga-alcove', 'THE YOGA ALCOVE', 'Spa & Wellness', 'AL WAAB, DOHA', '2023', '34 SQM', 'DELIVERED IN NINE WEEKS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY']::text[], 'A spare bedroom in an Al Waab family villa, turned into the room the household''s practice could not be imagined without.', 'A family villa with one unused bedroom and a modest budget. The mother of the house practised yoga in the living room, around the furniture, whenever it was free. She asked for somewhere that belonged to the practice alone.', 'The arched niches already roughed into the plasterwork were kept and completed rather than demolished — the room''s own geometry became its ornament. Warm lime plaster, a single blush tone, hidden storage for props, and lanterns instead of downlights. Nothing in the room asks for attention.', 'Nine weeks, one room, no structural work. The practice moved from occasional to daily within the first month — and the family''s two daughters now use it more than the mother does.', '[{"label":"AREA","value":"34 SQM"},{"label":"DELIVERY","value":"9 WEEKS"},{"label":"STRUCTURAL WORK","value":"NONE"}]'::jsonb, 'pair-the-yoga-alcove-after', array['extra-yoga-alcove', 'detail-yoga-alcove']::text[], 'pair-the-yoga-alcove-before', 'pair-the-yoga-alcove-after', 'A raw plaster room: unfinished niches, bare window openings, a bucket on the floor.', true, 'published', 3),
  ('al-waab-villa-gym', 'THE AL WAAB VILLA GYM', 'Residential', 'AL WAAB, DOHA', '2024', '48 SQM', 'DELIVERED IN TEN WEEKS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY']::text[], 'An ordinary family villa''s ground-floor majlis, converted into a home gym that looks out onto the courtyard.', 'A working family in Al Waab — two parents, three children, one formal majlis used perhaps four times a year. They wanted to train at home without turning the room into a garage full of equipment.', 'The room was kept as a room. The existing travertine was cleaned and carried up the walls; a single mirrored plane replaced one wall to double the courtyard light; a cove of warm light traces the ceiling. Equipment was chosen for silence and for how it looks when nobody is using it — because for most of the week, nobody is.', '48 SQM, ten weeks, delivered while the family remained in the house. The majlis is now used every day rather than four times a year.', '[{"label":"AREA","value":"48 SQM"},{"label":"DELIVERY","value":"10 WEEKS"},{"label":"FAMILY IN RESIDENCE","value":"THROUGHOUT"}]'::jsonb, 'pair-al-waab-villa-gym-after', '{}'::text[], 'pair-al-waab-villa-gym-before', 'pair-al-waab-villa-gym-after', 'An emptied majlis: dust sheets, exposed sockets, a contractor''s ladder and tool case.', false, 'published', 5),
  ('msheireb-townhouse-gym', 'THE MSHEIREB TOWNHOUSE GYM', 'Residential', 'MSHEIREB, DOHA', '2025', '38 SQM', 'DELIVERED IN ELEVEN WEEKS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'PROJECT SUPERVISION']::text[], 'A townhouse lower ground floor — damp, dark, and used for storage — rebuilt as the room its owner trains in before sunrise.', 'A Msheireb townhouse with a lower ground floor nobody entered: stud walls, storage, no daylight. The owner trains at 5:00 AM and wanted a room that would meet him at that hour rather than remind him of a basement.', 'Rather than fight the absence of daylight, the room was taken further into darkness. Black micro-cement, brass detailing, mirrors placed to lengthen rather than to watch, and light concealed entirely in the ceiling recess. The only bright surface in the room is the one the owner faces while he works.', 'A basement that clients now assume is a wine room until the door opens. Eleven weeks, no structural intervention, no daylight required.', '[{"label":"AREA","value":"38 SQM"},{"label":"DELIVERY","value":"11 WEEKS"},{"label":"NATURAL LIGHT","value":"NONE"}]'::jsonb, 'pair-msheireb-townhouse-gym-after', array['detail-msheireb-townhouse-gym']::text[], 'pair-msheireb-townhouse-gym-before', 'pair-msheireb-townhouse-gym-after', 'A stripped basement: exposed steel studwork, bare slab, a single work lamp and a ladder.', false, 'published', 6),
  ('al-rayyan-garden-room', 'THE AL RAYYAN GARDEN ROOM', 'Residential', 'AL RAYYAN, QATAR', '2024', '165 SQM', 'DELIVERED IN SIX MONTHS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'PROJECT SUPERVISION']::text[], 'A garden wing of an Al Rayyan family compound, rebuilt as a training room that reads as part of the house, not an annexe to it.', 'A multi-generational compound in Al Rayyan. The garden wing had been half-finished for years — stud walls, a dropped ceiling, a floor nobody had laid. Three generations wanted to use one room, at different hours, for very different things.', 'Deep green panelling and mirrored bays give the room the manners of the house rather than of a gym. Equipment is arranged in a loose circuit rather than in ranks, so a grandmother walking and a son rowing do not share a sightline. The garden was brought to the glass so the room always has somewhere to look.', '165 SQM in six months. All three generations use it daily — which was the brief, and is harder than it sounds.', '[{"label":"AREA","value":"165 SQM"},{"label":"DELIVERY","value":"6 MONTHS"},{"label":"GENERATIONS SERVED","value":"3"}]'::jsonb, 'pair-al-rayyan-garden-room-after', '{}'::text[], 'pair-al-rayyan-garden-room-before', 'pair-al-rayyan-garden-room-after', 'An unfinished wing: stud partitions, an open ceiling void, timber and plasterboard stacked on a bare screed.', false, 'published', 4),
  ('pearl-pool-pavilion', 'THE PEARL POOL PAVILION', 'Residential', 'THE PEARL, DOHA', '2023', '210 SQM', 'DELIVERED IN EIGHT MONTHS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'PROJECT SUPERVISION']::text[], 'A daylit pool and training pavilion on The Pearl, where the swim and the session belong to one room.', 'A villa with a pool shell poured but never finished, and a training room planned as a separate box beside it. The client asked why they were two rooms.', 'The dividing wall was never built. A skylight was cut above the threshold so the pool and the floor share the same daylight, and the stone deck runs continuously beneath both. Equipment sits on the dry side in a single quiet row; a lacquered column marks the pivot between water and work.', 'One room instead of two, and 40 SQM of circulation recovered. The pool is used more in the morning than the equipment is.', '[{"label":"AREA","value":"210 SQM"},{"label":"DELIVERY","value":"8 MONTHS"},{"label":"SPACE RECOVERED","value":"40 SQM"}]'::jsonb, 'pair-pearl-pool-pavilion-after', '{}'::text[], 'pair-pearl-pool-pavilion-before', 'pair-pearl-pool-pavilion-after', 'Exposed structure: an unlined concrete frame, scaffolding, blockwork, and an unfinished pool basin.', false, 'published', 7),
  ('meridian-wellness-floor', 'MERIDIAN WELLNESS FLOOR', 'Hospitality', 'WEST BAY, DOHA', '2025', '2,400 SQM', 'PHASED AROUND A LIVE HOTEL', array['HOSPITALITY WELLNESS', 'ARCHITECTURAL DESIGN', 'OPERATIONS & MANAGEMENT']::text[], 'A complete hotel wellness floor in West Bay — spa, pool, recovery, and fitness — unified under one material language.', 'Replace a fragmented amenity floor — separate gym, spa, and pool with three different identities — with one continuous wellness journey worthy of the hotel''s positioning, without closing the hotel.', 'A single palette of charcoal stone, dark timber, and bronze now carries the guest from corridor to pool without a visual seam. Service routes were redrawn so staff presence is felt as readiness, never as traffic. The floor was delivered in four phases, each handed back before the next began.', 'Guest dwell time on the floor doubled in the first quarter after reopening, and the spa moved from cost centre to the hotel''s most requested amenity.', '[]'::jsonb, 'portfolio-meridian-wellness-floor', array['detail-meridian-wellness-floor', 'video-hospitality']::text[], null, null, null, false, 'published', 8),
  ('lusail-performance-club', 'LUSAIL PERFORMANCE CLUB', 'Gyms & Fitness', 'LUSAIL, QATAR', '2023', '1,800 SQM', 'DELIVERED IN NINE MONTHS', array['COMMERCIAL & RESIDENTIAL WELLNESS', 'EQUIPMENT & SUPPLY', 'BUSINESS CONSULTING']::text[], 'A commercial performance club in Lusail, built to hold serious training culture at membership scale.', 'Create a commercial club that serious athletes would claim as their own, without alienating the broader membership that makes the business viable.', 'Training disciplines were arranged as districts within one hall rather than rooms behind doors, so ambition is always visible but never imposed. Acoustic zoning and lighting temperature shift by district; the material language never does.', 'The club reached its two-year membership target in eight months, with retention highest among the everyday members the brief feared losing.', '[]'::jsonb, 'portfolio-lusail-performance-club', array['detail-lusail-performance-club', 'still-lusail']::text[], null, null, null, false, 'published', 9),
  ('holland-park-suite', 'THE HOLLAND PARK SUITE', 'Residential', 'HOLLAND PARK, LONDON', '2022', '190 SQM', 'DELIVERED IN FIVE MONTHS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'PROJECT SUPERVISION']::text[], 'A residential wellness suite folded into the lower floors of a Holland Park house — gym, steam, and cold plunge in 190 SQM.', 'Fit a complete wellness programme — strength, cardio, steam, cold plunge — into the lower two floors of a London townhouse without the result feeling compressed, and without touching the listed façade.', 'Rather than dividing the floors into small rooms, functions were arranged along one lit limestone wall, borrowing scale from each other. Equipment was specified at residential acoustics; in a terrace, what the neighbours hear is part of the brief. The loudest object in the suite is the water.', 'A complete daily circuit in under 200 SQM, delivered within conservation constraints. The suite is used by three generations of one family, each at a different hour.', '[]'::jsonb, 'portfolio-holland-park-suite', array['detail-holland-park-suite', 'still-residential']::text[], null, null, null, false, 'published', 10),
  ('marylebone-recovery-atelier', 'THE MARYLEBONE RECOVERY ATELIER', 'Spa & Wellness', 'MARYLEBONE, LONDON', '2024', '340 SQM', 'DELIVERED IN SEVEN MONTHS', array['ARCHITECTURAL DESIGN', 'EQUIPMENT & SUPPLY', 'OPERATIONS & MANAGEMENT']::text[], 'A members'' recovery atelier off Marylebone High Street — contrast therapy treated with the gravity of craft.', 'Bring the discipline of craft to a recovery club: contrast therapy, breathwork, and bodywork for a members'' clientele that measures everything against the standards of the houses around it.', 'The atelier was composed like a workshop: dark stone basins, aged bronze, a strict choreography from heat to cold to rest. Every fixture was drawn, not selected. The plunge pools are lit only from within the water.', 'Membership filled from the waiting list before opening. The atelier now anchors its building''s identity — the address is quoted by the club, not the reverse.', '[]'::jsonb, 'portfolio-marylebone-recovery-atelier', array['detail-marylebone-recovery-atelier']::text[], null, null, null, false, 'published', 11),
  ('city-performance-floor', 'THE CITY PERFORMANCE FLOOR', 'Gyms & Fitness', 'CITY OF LONDON', '2022', '1,100 SQM', 'DELIVERED FLOOR-BY-FLOOR IN A LIVE TOWER', array['COMMERCIAL & RESIDENTIAL WELLNESS', 'ARCHITECTURAL DESIGN', 'OPERATIONS & MANAGEMENT']::text[], 'A corporate wellness facility above the City of London, built to make training the calmest hour of the working day.', 'Give a City financial group''s people a reason to stay in the building: a wellness floor that answers the intensity of the trading floor with equal and opposite calm.', 'The floor was stripped to structure and rebuilt in a dark, quiet palette against the skyline — matte black equipment, gunmetal, walnut. Lighting follows the working day: cooler at 6 AM, warm through a London winter afternoon. No screens face the glass.', 'Daily utilisation stabilised above 60% of headcount. The group reports the floor now appears in recruiting conversations unprompted.', '[]'::jsonb, 'portfolio-city-performance-floor', array['detail-city-performance-floor']::text[], null, null, null, false, 'published', 12),
  ('katara-stone-spa', 'THE KATARA STONE SPA', 'Spa & Wellness', 'KATARA, DOHA', '2023', '520 SQM', 'DELIVERED ACROSS TWO PHASES', array['HOSPITALITY WELLNESS', 'ARCHITECTURAL DESIGN', 'PROJECT SUPERVISION']::text[], 'A spa cut into dark stone at Katara, where controlled darkness is the treatment.', 'Create a spa for a cultural-district hotel that would resist the region''s default vocabulary — no gold, no gloss, no lobby-scale gesture competing with the treatment itself.', 'The spa descends into dark stone. Daylight enters through narrow cuts, arriving as blades across rock and water. Treatment rooms hold the temperature of the stone. The city is heard, faintly, and never seen.', 'The spa books independently of hotel occupancy — guests travel across Doha for the darkness itself. Average treatment spend runs well above the district benchmark.', '[]'::jsonb, 'portfolio-katara-stone-spa', array['detail-katara-stone-spa', 'video-materials']::text[], null, null, null, false, 'published', 13),
  ('the-obsidian-room', 'THE OBSIDIAN ROOM', 'Dining & Lifestyle', 'AL SADD, DOHA', '2025', '220 SQM', 'DELIVERED IN FOUR MONTHS', array['ARCHITECTURAL DESIGN', 'PROJECT SUPERVISION']::text[], 'A private dining room for an Al Sadd wellness club — the evening counterpart to the morning''s discipline.', 'Give a members'' wellness club a dining room that carries the same authorship as its training floors — a room where the evening meal belongs to the same life as the 6 AM session.', 'One long honed-stone table sits under a single precise line of light. Charcoal plaster, dark walnut, aged bronze; the acoustics tuned for conversation at one table, not turnover. The kitchen is heard faintly, like weather.', 'The room rebalanced the club''s day — evening attendance now matches morning. Members describe dinner there as part of the practice, not a reward for it.', '[]'::jsonb, 'portfolio-the-obsidian-room', array['detail-the-obsidian-room']::text[], null, null, null, false, 'published', 14)
on conflict (slug) do nothing;

insert into testimonials (quote, attribution, sort_order) values
  ('“THEY DIDN’T DESIGN A GYM.
THEY DESIGNED THE REASON
I WAKE UP AT 5:30.”', 'PRIVATE CLIENT — DOHA', 1),
  ('“THE SPACE RUNS AS PRECISELY TODAY
AS THE DAY IT OPENED.”', 'HOTEL GROUP — WEST BAY', 2),
  ('“EVERY DECISION HAD ALREADY BEEN CONSIDERED
BEFORE WE THOUGHT TO ASK.”', 'PROPERTY DEVELOPER — LUSAIL', 3);

update site_settings set
  contact_email = 'hello@velora.qa',
  studio_address = array['SAFWA BUILDING', 'GATE 20', 'SECOND FLOOR', 'BARWA COMMERCIAL AVENUE', 'DOHA, QATAR']::text[],
  figures = '[{"value":50000,"suffix":"+","label":"SQM COMPLETED"},{"value":100,"suffix":"+","label":"PROJECTS DELIVERED"},{"value":20,"suffix":"+","label":"YEARS OF EXPERIENCE"}]'::jsonb
where id;
