-- ============================================================
-- Space Canvas catalog: everything the public configurator at
-- /space-canvas/ prices and draws, managed from /admin/canvas.
--
--   canvas_materials    finishes, with a texture photo and a price per surface
--   canvas_equipment    machines and furniture: footprint, photo, price per tier
--   canvas_spaces       space types: sizing, fit-out rate per tier, layout rules
--   canvas_space_items  what each space contains, how many, and its priority
--   canvas_features     extras placed in a space (planters, skylight…)
--   canvas_settings     Feel tiers, glass, lighting, systems and fees
--
-- Prices are QAR and are samples until VELORA's price list replaces them.
-- Anyone may read the catalog (the configurator is public); only managers
-- may change it.
-- ============================================================

do $$ begin
  create type canvas_item_priority as enum ('essential', 'recommended', 'optional');
exception when duplicate_object then null; end $$;

do $$ begin
  create type canvas_qty_mode as enum ('fixed', 'per_m2', 'per_unit');
exception when duplicate_object then null; end $$;

create table if not exists canvas_materials (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  key           text not null unique,
  label         text not null,
  image         text,                    -- texture photo (repeats across the surface)
  tile_m        numeric not null default 2,  -- the photo covers this many metres before repeating
  tone          text not null default '#888888', -- average colour, for flat views
  effect        text,                    -- slats | mirror | stretch
  price_floor   numeric,                 -- QAR / m²; null = not offered as a floor
  price_walls   numeric,
  price_ceiling numeric,
  floor_dry     boolean not null default false,  -- which floors it suits
  floor_wet     boolean not null default false,
  floor_out     boolean not null default false,
  active        boolean not null default true,
  sort_order    int not null default 0
);

create table if not exists canvas_equipment (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  key             text not null unique,
  label           text not null,
  category        text not null default 'Other',
  image           text,
  width_m         numeric not null default 1,
  depth_m         numeric not null default 1,
  height_m        numeric not null default 1,
  clearance_m     numeric not null default 0.6,  -- free floor needed around it
  shape           text not null default 'machine', -- how the 3D model draws it
  price_essential numeric not null default 0,
  price_premium   numeric not null default 0,
  price_signature numeric not null default 0,
  note            text,
  active          boolean not null default true,
  sort_order      int not null default 0
);

create table if not exists canvas_spaces (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  key             text not null unique,
  label           text not null,
  location        text not null default 'in' check (location in ('in', 'out')),
  kind            text not null default 'dry' check (kind in ('dry', 'wet', 'out')),
  group_name      text not null default 'Other rooms',
  sizing          text not null default 'area' check (sizing in ('area', 'unit')),
  default_amount  numeric not null default 20,
  min_amount      numeric not null default 5,
  max_amount      numeric not null default 900,
  step            numeric not null default 5,
  unit_footprint  numeric,                 -- m² per room/unit, for unit-sized spaces
  deck_factor     numeric,                 -- pools: footprint = water × this
  rate_essential  numeric not null default 0,  -- fit-out, QAR per m² (or per unit)
  rate_premium    numeric not null default 0,
  rate_signature  numeric not null default 0,
  default_floor   text,                    -- material key; null = the Feel default
  note            text,
  image           text,
  heavy           boolean not null default false,  -- weights/machines: load & acoustic checks
  heat            boolean not null default false,  -- needs extraction
  pool            boolean not null default false,
  forgotten       boolean not null default false,  -- flagged "often forgotten"
  kept            boolean not null default false,  -- existing room: no works, no cost
  named           boolean not null default false,  -- the client names it
  light           text not null default 'neutral' check (light in ('want', 'avoid', 'neutral')),
  entrance        text not null default 'neutral' check (entrance in ('near', 'far', 'neutral')),
  pillars_ok      boolean not null default false,
  priority        int not null default 3 check (priority between 1 and 5), -- placed first when higher
  render          text not null default 'contents', -- contents | pool | cells | court | firepit
  cell_style      text,
  active          boolean not null default true,
  sort_order      int not null default 0
);

create table if not exists canvas_space_items (
  id            uuid primary key default gen_random_uuid(),
  space_id      uuid not null references canvas_spaces(id) on delete cascade,
  equipment_id  uuid not null references canvas_equipment(id) on delete cascade,
  priority      canvas_item_priority not null default 'essential',
  qty_mode      canvas_qty_mode not null default 'fixed',
  qty           numeric not null default 1,  -- fixed: count · per_m2: one per this many m² · per_unit: per room
  min_qty       int not null default 0,
  max_qty       int not null default 99,
  sort_order    int not null default 0
);

create index if not exists idx_canvas_items_space on canvas_space_items(space_id);

create table if not exists canvas_features (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  key             text not null unique,
  label           text not null,
  mode            text not null default 'toggle' check (mode in ('toggle', 'count')),
  max_count       int not null default 1,
  location        text not null default 'any' check (location in ('in', 'out', 'any')),
  image           text,
  price_essential numeric not null default 0,
  price_premium   numeric not null default 0,
  price_signature numeric not null default 0,
  active          boolean not null default true,
  sort_order      int not null default 0
);

create table if not exists canvas_settings (
  id         boolean primary key default true check (id),
  tiers      jsonb not null default '{}',
  glass      jsonb not null default '[]',
  lighting   jsonb not null default '[]',
  fees       jsonb not null default '{}',
  systems    jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_canvas_settings_updated_at on canvas_settings;
create trigger trg_canvas_settings_updated_at
  before update on canvas_settings
  for each row execute function set_updated_at();

-- ---------- Access: public read, managers write ----------
do $$
declare t text;
begin
  foreach t in array array['canvas_materials', 'canvas_equipment', 'canvas_spaces', 'canvas_space_items', 'canvas_features', 'canvas_settings'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "anyone can read %s" on %I', t, t);
    execute format('create policy "anyone can read %s" on %I for select to anon, authenticated using (true)', t, t);
    execute format('drop policy if exists "%s manager only" on %I', t, t);
    execute format('create policy "%s manager only" on %I for all to authenticated using (public.jwt_app_role() = ''manager'') with check (public.jwt_app_role() = ''manager'')', t, t);
    execute format('grant select on %I to anon', t);
    execute format('grant select, insert, update, delete on %I to authenticated, service_role', t);
  end loop;
end $$;

-- ============================================================
-- Seed: what the configurator used to hardcode, plus a sample
-- equipment catalog and the contents of each space.
-- ============================================================

insert into canvas_materials (key, label, image, tile_m, tone, effect, price_floor, price_walls, price_ceiling, floor_dry, floor_wet, floor_out, sort_order) values
  ('rubber', 'Sports rubber', '/space-canvas/materials/rubber.jpg', 1.2, '#1f2022', null, 200, null, null, true, false, false, 1),
  ('oak', 'Engineered oak', '/space-canvas/materials/oak.jpg', 2.2, '#6c4213', null, 460, null, null, true, false, false, 2),
  ('microcement', 'Microcement', '/space-canvas/materials/microcement.jpg', 3, '#b8b8b8', null, 520, 380, null, true, true, false, 3),
  ('concrete', 'Polished concrete', '/space-canvas/materials/concrete.jpg', 3, '#989388', null, 380, null, 120, true, false, false, 4),
  ('terrazzo', 'Terrazzo', '/space-canvas/materials/terrazzo.jpg', 1.6, '#c1bcb7', null, 640, null, null, true, true, false, 5),
  ('travertine', 'Travertine', '/space-canvas/materials/travertine-light.jpg', 2.4, '#dfcbac', null, 820, 900, null, true, true, true, 6),
  ('basalt', 'Basalt tile', '/space-canvas/materials/basalt.jpg', 2.4, '#353536', null, 760, null, null, true, true, false, 7),
  ('marble', 'Marble', '/space-canvas/materials/marble.jpg', 2.4, '#acadb5', null, 1100, 1300, null, true, true, false, 8),
  ('turf', 'Training turf', '/space-canvas/materials/turf.jpg', 2.5, '#65832b', null, 260, null, null, true, false, true, 9),
  ('tile', 'White ceramic', '/space-canvas/materials/tile-white.jpg', 1.2, '#f2f2f2', null, 420, 340, null, false, true, false, 10),
  ('decking', 'Hardwood decking', '/space-canvas/materials/decking.jpg', 2.4, '#6e340d', null, 650, null, null, false, false, true, 11),
  ('pavers', 'Stone pavers', '/space-canvas/materials/stone-pavers.jpg', 3, '#d2cac2', null, 480, null, null, false, false, true, 12),
  ('lawn', 'Lawn', '/space-canvas/materials/lawn.jpg', 3, '#445b28', null, 90, null, null, false, false, true, 13),
  ('gravel', 'White gravel', '/space-canvas/materials/gravel.jpg', 2, '#d9d6ce', null, 70, null, null, false, false, true, 14),
  ('plaster', 'Painted plaster', '/space-canvas/materials/plaster.jpg', 3, '#d7d3cf', null, null, 110, 80, false, false, false, 15),
  ('fabric', 'Acoustic fabric', '/space-canvas/materials/fabric.jpg', 1.6, '#746f5d', null, null, 360, 300, false, false, false, 16),
  ('walnut', 'Walnut slats', '/space-canvas/materials/walnut.jpg', 1.6, '#41342e', 'slats', null, 560, 460, false, false, false, 17),
  ('ash', 'Ash slats', '/space-canvas/materials/ash.jpg', 1.6, '#a0795a', 'slats', null, 500, 420, false, false, false, 18),
  ('travertine-noce', 'Noce travertine', '/space-canvas/materials/travertine.jpg', 2.4, '#5f5147', null, null, 950, null, false, false, false, 19),
  ('mirror', 'Mirror', null, 2, '#9aa2a8', 'mirror', null, 300, null, false, false, false, 20),
  ('stretch', 'Stretch ceiling', null, 2, '#e6e6e2', 'stretch', null, null, 360, false, false, false, 21)
on conflict (key) do nothing;

insert into canvas_equipment (key, label, category, width_m, depth_m, height_m, clearance_m, shape, price_essential, price_premium, price_signature, sort_order) values
  ('treadmill', 'Treadmill', 'Cardio', 0.9, 2.1, 1.5, 0.6, 'machine', 22000, 42000, 78000, 1),
  ('crosstrainer', 'Cross-trainer', 'Cardio', 0.8, 2.0, 1.7, 0.6, 'machine', 16000, 32000, 58000, 2),
  ('upright-bike', 'Upright bike', 'Cardio', 0.6, 1.2, 1.3, 0.5, 'bike', 9000, 18000, 32000, 3),
  ('rower', 'Rowing machine', 'Cardio', 0.6, 2.4, 0.6, 0.5, 'machine', 8000, 14000, 26000, 4),
  ('stair-climber', 'Stair climber', 'Cardio', 0.9, 1.6, 2.0, 0.6, 'machine', 24000, 45000, 80000, 5),
  ('power-rack', 'Power rack & platform', 'Strength', 1.4, 1.4, 2.3, 0.9, 'rig', 14000, 28000, 52000, 6),
  ('cable', 'Cable crossover', 'Strength', 1.6, 1.0, 2.3, 0.8, 'machine', 26000, 48000, 90000, 7),
  ('selectorized', 'Selectorized machine', 'Strength', 1.2, 1.6, 1.6, 0.6, 'machine', 18000, 34000, 62000, 8),
  ('bench', 'Adjustable bench', 'Strength', 0.6, 1.4, 0.5, 0.6, 'bench', 2500, 5000, 9000, 9),
  ('dumbbells', 'Dumbbell set & rack', 'Strength', 2.4, 0.7, 0.9, 0.8, 'shelf', 15000, 32000, 60000, 10),
  ('rig', 'Functional rig', 'Functional', 4.0, 1.2, 2.6, 1.0, 'rig', 18000, 32000, 55000, 11),
  ('sled-kit', 'Sled & kettlebell kit', 'Functional', 1.2, 0.6, 0.6, 0.8, 'kit', 4000, 8000, 15000, 12),
  ('heavy-bag', 'Heavy bag', 'Studio', 0.4, 0.4, 1.1, 0.9, 'bag', 1500, 3500, 7000, 13),
  ('spin-bike', 'Studio bike', 'Studio', 0.5, 1.1, 1.05, 0.35, 'bike', 6000, 12000, 22000, 14),
  ('mat', 'Mat & props set', 'Studio', 0.65, 1.85, 0.02, 0.35, 'mat', 400, 900, 2000, 15),
  ('reformer', 'Pilates reformer', 'Studio', 0.7, 2.4, 0.45, 0.5, 'bench', 18000, 32000, 55000, 16),
  ('lounger', 'Relaxation lounger', 'Furniture', 0.75, 1.9, 0.4, 0.4, 'lounger', 3500, 9000, 22000, 17),
  ('lockers', 'Locker bank (6 doors)', 'Furniture', 1.8, 0.5, 1.9, 0.9, 'locker', 9000, 18000, 36000, 18),
  ('changing-bench', 'Changing bench', 'Furniture', 1.6, 0.4, 0.45, 0.6, 'bench', 1500, 3500, 8000, 19),
  ('vanity', 'Vanity & dryer station', 'Furniture', 1.2, 0.6, 0.9, 0.6, 'counter', 6000, 14000, 30000, 20),
  ('reception-desk', 'Reception desk', 'Furniture', 2.4, 0.7, 1.05, 0.9, 'counter', 18000, 38000, 80000, 21),
  ('bar', 'Juice bar counter', 'Furniture', 3.0, 0.7, 1.05, 0.9, 'counter', 25000, 48000, 95000, 22),
  ('table-set', 'Table & two chairs', 'Furniture', 0.7, 0.7, 0.75, 0.6, 'table', 1500, 3500, 8000, 23),
  ('desk', 'Desk & chair', 'Furniture', 1.4, 0.7, 0.75, 0.6, 'counter', 2500, 6000, 14000, 24),
  ('treatment-bed', 'Treatment bed', 'Care', 0.8, 2.0, 0.7, 0.6, 'bench', 8000, 16000, 32000, 25),
  ('filtration', 'Filtration & pump skid', 'Plant', 1.0, 1.0, 1.8, 0.6, 'tank', 25000, 40000, 60000, 26),
  ('washer', 'Washer / dryer', 'Plant', 0.7, 0.65, 0.9, 0.5, 'washer', 9000, 14000, 22000, 27),
  ('shelving', 'Storage shelving', 'Plant', 1.2, 0.45, 2.1, 0.8, 'shelf', 900, 1800, 3500, 28),
  ('sun-lounger', 'Outdoor lounger', 'Outdoor', 0.75, 1.9, 0.38, 0.4, 'lounger', 2500, 6500, 16000, 29),
  ('outdoor-rig', 'Outdoor training rig', 'Outdoor', 3.0, 1.0, 2.4, 1.0, 'rig', 14000, 24000, 40000, 30)
on conflict (key) do nothing;

insert into canvas_spaces (key, label, location, kind, group_name, sizing, default_amount, min_amount, max_amount, step, unit_footprint, deck_factor, default_floor, note, heavy, heat, pool, forgotten, kept, named, light, entrance, pillars_ok, priority, render, cell_style, rate_essential, rate_premium, rate_signature, sort_order) values
  ('gym', 'Gym floor', 'in', 'dry', 'Training', 'area', 70, 5, 900, 5, null, null, 'rubber', 'Cardio & strength floor', true, false, false, false, false, false, 'want', 'neutral', true, 4, 'contents', null, 1000, 1700, 2900, 1),
  ('functional', 'Functional zone', 'in', 'dry', 'Training', 'area', 35, 5, 900, 5, null, null, 'turf', 'Turf lane, rig & sleds', true, false, false, false, false, false, 'want', 'neutral', true, 3, 'contents', null, 700, 1100, 1700, 2),
  ('boxing', 'Boxing studio', 'in', 'dry', 'Training', 'area', 35, 5, 900, 5, null, null, 'rubber', null, true, false, false, false, false, false, 'neutral', 'neutral', true, 3, 'contents', null, 1100, 1700, 2700, 3),
  ('studio', 'Yoga & pilates', 'in', 'dry', 'Training', 'area', 40, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'want', 'neutral', false, 3, 'contents', null, 1200, 2000, 3400, 4),
  ('spin', 'Spin studio', 'in', 'dry', 'Training', 'area', 35, 5, 900, 5, null, null, 'rubber', null, false, false, false, false, false, false, 'want', 'neutral', false, 3, 'contents', null, 1300, 2000, 3200, 5),
  ('pool', 'Indoor pool', 'in', 'wet', 'Water', 'area', 40, 5, 900, 5, null, 1.8, null, 'm² of water, deck added', false, false, true, false, false, false, 'want', 'neutral', false, 5, 'pool', null, 9000, 14000, 22000, 6),
  ('hydro', 'Hydrotherapy pool', 'in', 'wet', 'Water', 'area', 16, 5, 900, 5, null, 2, null, null, false, false, true, false, false, false, 'want', 'neutral', false, 5, 'pool', null, 14000, 21000, 32000, 7),
  ('plunge', 'Cold plunge', 'in', 'wet', 'Water', 'unit', 1, 1, 6, 1, 4, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'cells', 'plunge', 45000, 80000, 140000, 8),
  ('showers', 'Experience showers', 'in', 'wet', 'Water', 'unit', 2, 1, 10, 1, 2.5, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'cells', 'glass', 22000, 42000, 75000, 9),
  ('sauna', 'Sauna', 'in', 'dry', 'Heat', 'unit', 1, 1, 6, 1, 6, null, null, null, false, true, false, false, false, false, 'avoid', 'far', false, 3, 'cells', 'wood', 55000, 95000, 170000, 10),
  ('infrared', 'Infrared sauna', 'in', 'dry', 'Heat', 'unit', 1, 1, 6, 1, 4, null, null, null, false, true, false, false, false, false, 'avoid', 'neutral', false, 2, 'cells', 'infrared', 35000, 60000, 110000, 11),
  ('steam', 'Steam room', 'in', 'wet', 'Heat', 'unit', 1, 1, 6, 1, 6, null, null, null, false, true, false, false, false, false, 'avoid', 'far', false, 3, 'cells', 'steam', 70000, 120000, 200000, 12),
  ('hammam', 'Hammam', 'in', 'wet', 'Heat', 'unit', 1, 1, 3, 1, 16, null, null, null, false, true, false, false, false, false, 'avoid', 'far', false, 3, 'cells', 'dome', 160000, 280000, 450000, 13),
  ('salt', 'Salt room', 'in', 'dry', 'Heat', 'unit', 1, 1, 3, 1, 12, null, null, null, false, false, false, false, false, false, 'avoid', 'far', false, 2, 'cells', 'salt', 90000, 150000, 240000, 14),
  ('treatment', 'Treatment rooms', 'in', 'dry', 'Care', 'unit', 2, 1, 12, 1, 12, null, null, null, false, false, false, false, false, false, 'avoid', 'far', false, 3, 'cells', 'room', 32000, 54000, 85000, 15),
  ('cryo', 'Cryotherapy', 'in', 'dry', 'Care', 'unit', 1, 1, 2, 1, 6, null, null, null, false, false, false, false, false, false, 'avoid', 'neutral', false, 2, 'cells', 'cryo', 180000, 240000, 320000, 16),
  ('lounge', 'Relaxation lounge', 'in', 'dry', 'Hospitality', 'area', 30, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'want', 'neutral', true, 3, 'contents', null, 1300, 2200, 3800, 17),
  ('changing', 'Changing & lockers', 'in', 'wet', 'Hospitality', 'area', 30, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'avoid', 'near', true, 4, 'contents', null, 1800, 2900, 4800, 18),
  ('reception', 'Reception', 'in', 'dry', 'Hospitality', 'area', 15, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'want', 'near', true, 4, 'contents', null, 1500, 2500, 4200, 19),
  ('cafe', 'Juice bar & café', 'in', 'dry', 'Hospitality', 'area', 25, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'want', 'near', true, 3, 'contents', null, 1700, 2700, 4400, 20),
  ('office', 'Office', 'in', 'dry', 'Support', 'area', 12, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', true, 2, 'contents', null, 1000, 1600, 2500, 21),
  ('plantroom', 'Plant room', 'in', 'dry', 'Support', 'area', 15, 5, 900, 5, null, null, 'concrete', 'Pumps, filtration, air handling', false, false, false, true, false, false, 'avoid', 'far', false, 4, 'contents', null, 900, 1100, 1300, 22),
  ('laundry', 'Laundry', 'in', 'wet', 'Support', 'area', 10, 5, 900, 5, null, null, null, null, false, false, false, true, false, false, 'avoid', 'far', false, 2, 'contents', null, 1500, 1900, 2400, 23),
  ('storage', 'Storage', 'in', 'dry', 'Support', 'area', 8, 5, 900, 5, null, null, 'concrete', null, false, false, false, true, false, false, 'avoid', 'far', true, 2, 'contents', null, 450, 550, 700, 24),
  ('custom', 'Custom room', 'in', 'dry', 'Other rooms', 'area', 20, 5, 900, 5, null, null, null, 'Name it yourself', false, false, false, false, false, true, 'neutral', 'neutral', false, 2, 'contents', null, 1500, 2500, 4000, 25),
  ('existing', 'Existing room (kept)', 'in', 'dry', 'Other rooms', 'area', 20, 5, 900, 5, null, null, null, 'Stays as it is: no works, no cost', false, false, false, false, true, true, 'neutral', 'neutral', true, 5, 'contents', null, 0, 0, 0, 26),
  ('opool', 'Outdoor pool', 'out', 'out', 'Water', 'area', 50, 5, 900, 5, null, 2.2, null, null, false, false, true, false, false, false, 'neutral', 'neutral', false, 5, 'pool', null, 7000, 11000, 18000, 27),
  ('hottub', 'Hot tub', 'out', 'out', 'Water', 'unit', 1, 1, 4, 1, 9, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'cells', 'tub', 45000, 85000, 150000, 28),
  ('oshower', 'Outdoor shower', 'out', 'out', 'Water', 'unit', 1, 1, 6, 1, 3, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'cells', 'glass', 12000, 22000, 38000, 29),
  ('sundeck', 'Sun deck', 'out', 'out', 'Leisure', 'area', 40, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'contents', null, 600, 1000, 1700, 30),
  ('ydeck', 'Yoga deck', 'out', 'out', 'Leisure', 'area', 30, 5, 900, 5, null, null, 'decking', null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'contents', null, 600, 1000, 1800, 31),
  ('firepit', 'Fire-pit lounge', 'out', 'out', 'Leisure', 'area', 20, 5, 900, 5, null, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'firepit', null, 1600, 2800, 4800, 32),
  ('garden', 'Garden', 'out', 'out', 'Leisure', 'area', 60, 5, 900, 5, null, null, 'lawn', null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'contents', null, 250, 480, 900, 33),
  ('ogym', 'Outdoor gym', 'out', 'out', 'Sport', 'area', 40, 5, 900, 5, null, null, 'turf', null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'contents', null, 700, 1100, 1700, 34),
  ('padel', 'Padel court', 'out', 'out', 'Sport', 'unit', 1, 1, 3, 1, 200, null, null, null, false, false, false, false, false, false, 'neutral', 'neutral', false, 3, 'court', null, 180000, 240000, 320000, 35)
on conflict (key) do nothing;

insert into canvas_space_items (space_id, equipment_id, priority, qty_mode, qty, min_qty, max_qty, sort_order)
select s.id, e.id, v.priority::canvas_item_priority, v.qty_mode::canvas_qty_mode, v.qty, v.min_qty, v.max_qty, v.sort_order from (values
  ('gym', 'treadmill', 'essential', 'per_m2', 18, 1, 12, 1),
  ('gym', 'power-rack', 'essential', 'per_m2', 35, 1, 6, 2),
  ('gym', 'bench', 'essential', 'per_m2', 20, 1, 8, 3),
  ('gym', 'dumbbells', 'essential', 'fixed', 1, 1, 1, 4),
  ('gym', 'upright-bike', 'recommended', 'per_m2', 30, 0, 6, 5),
  ('gym', 'crosstrainer', 'recommended', 'per_m2', 35, 0, 6, 6),
  ('gym', 'cable', 'recommended', 'fixed', 1, 1, 1, 7),
  ('gym', 'rower', 'optional', 'per_m2', 35, 0, 4, 8),
  ('gym', 'selectorized', 'optional', 'per_m2', 25, 0, 10, 9),
  ('gym', 'stair-climber', 'optional', 'fixed', 1, 1, 1, 10),
  ('functional', 'rig', 'essential', 'fixed', 1, 1, 1, 11),
  ('functional', 'sled-kit', 'recommended', 'per_m2', 15, 1, 4, 12),
  ('boxing', 'heavy-bag', 'essential', 'per_m2', 5, 2, 16, 13),
  ('studio', 'mat', 'essential', 'per_m2', 3, 4, 30, 14),
  ('studio', 'reformer', 'optional', 'per_m2', 8, 0, 10, 15),
  ('spin', 'spin-bike', 'essential', 'per_m2', 2.2, 6, 40, 16),
  ('treatment', 'treatment-bed', 'essential', 'per_unit', 1, 1, 12, 17),
  ('lounge', 'lounger', 'essential', 'per_m2', 4, 2, 20, 18),
  ('changing', 'lockers', 'essential', 'per_m2', 8, 1, 12, 19),
  ('changing', 'changing-bench', 'essential', 'per_m2', 10, 1, 8, 20),
  ('changing', 'vanity', 'recommended', 'per_m2', 15, 0, 6, 21),
  ('reception', 'reception-desk', 'essential', 'fixed', 1, 1, 1, 22),
  ('cafe', 'bar', 'essential', 'fixed', 1, 1, 1, 23),
  ('cafe', 'table-set', 'recommended', 'per_m2', 6, 1, 12, 24),
  ('office', 'desk', 'essential', 'per_m2', 6, 1, 8, 25),
  ('plantroom', 'filtration', 'essential', 'per_m2', 6, 1, 6, 26),
  ('laundry', 'washer', 'essential', 'per_m2', 3, 1, 8, 27),
  ('storage', 'shelving', 'essential', 'per_m2', 3, 1, 12, 28),
  ('sundeck', 'sun-lounger', 'essential', 'per_m2', 4, 2, 20, 29),
  ('ydeck', 'mat', 'essential', 'per_m2', 3, 4, 30, 30),
  ('ogym', 'outdoor-rig', 'essential', 'fixed', 1, 1, 1, 31)
) as v(space_key, equipment_key, priority, qty_mode, qty, min_qty, max_qty, sort_order)
join canvas_spaces s on s.key = v.space_key join canvas_equipment e on e.key = v.equipment_key
where not exists (select 1 from canvas_space_items);

insert into canvas_features (key, label, mode, max_count, location, price_essential, price_premium, price_signature, sort_order) values
  ('planters', 'Planters', 'count', 12, 'any', 1800, 3500, 7000, 1),
  ('greenwall', 'Green wall', 'toggle', 1, 'in', 28000, 45000, 75000, 2),
  ('skylight', 'Skylight', 'toggle', 1, 'in', 35000, 60000, 95000, 3),
  ('mirror', 'Mirror wall', 'toggle', 1, 'in', 9000, 16000, 28000, 4),
  ('screens', 'Screens', 'count', 8, 'in', 6000, 11000, 18000, 5),
  ('water', 'Water feature', 'toggle', 1, 'any', 25000, 48000, 90000, 6),
  ('art', 'Sculpture', 'count', 4, 'any', 8000, 20000, 45000, 7),
  ('trees', 'Trees', 'count', 12, 'out', 3500, 7000, 15000, 8),
  ('pergola', 'Pergola', 'toggle', 1, 'out', 38000, 65000, 110000, 9),
  ('parasols', 'Parasols', 'count', 8, 'out', 2500, 5500, 12000, 10)
on conflict (key) do nothing;

insert into canvas_settings (id, tiers, glass, lighting, fees, systems) values (true, '{"essential": {"label": "Essential", "line": "Plaster, ceramic, clear glass, even light.", "dry": {"floor": "rubber", "walls": "plaster", "ceiling": "plaster"}, "wet": {"floor": "tile", "walls": "tile", "ceiling": "plaster"}, "out": {"floor": "pavers"}, "hall": "microcement", "glass": "clear", "lighting": "even"}, "premium": {"label": "Premium", "line": "Oak, walnut, terrazzo, warm layered light.", "dry": {"floor": "oak", "walls": "walnut", "ceiling": "fabric"}, "wet": {"floor": "terrazzo", "walls": "microcement", "ceiling": "plaster"}, "out": {"floor": "decking"}, "hall": "oak", "glass": "frameless", "lighting": "layered"}, "signature": {"label": "Signature", "line": "Travertine, marble, fluted glass, light lines.", "dry": {"floor": "travertine", "walls": "travertine-noce", "ceiling": "walnut"}, "wet": {"floor": "marble", "walls": "marble", "ceiling": "stretch"}, "out": {"floor": "travertine"}, "hall": "travertine", "glass": "fluted", "lighting": "lines"}}'::jsonb, '[{"key": "none", "label": "Solid walls", "price": 0}, {"key": "clear", "label": "Clear", "price": 380}, {"key": "frameless", "label": "Frameless", "price": 640}, {"key": "fluted", "label": "Fluted", "price": 760}, {"key": "smart", "label": "Smart, switchable", "price": 1500}, {"key": "bronze", "label": "Bronze tint", "price": 820}]'::jsonb, '[{"key": "even", "label": "Even LED", "price": 150}, {"key": "layered", "label": "Layered, dimmable", "price": 320}, {"key": "lines", "label": "Light lines", "price": 540}, {"key": "circadian", "label": "Circadian", "price": 700}]'::jsonb, '{"design": 0.12, "range": 0.1}'::jsonb, '{"hvac": {"label": "Fresh air & cooling", "base": 0, "rate": 260}, "dehum": {"label": "Pool dehumidification", "base": 150000, "rate": 1800}, "water": {"label": "Water treatment (UV + ozone)", "base": 90000, "rate": 15000}, "waterproof": {"label": "Waterproofing & tanking", "base": 0, "rate": 420}, "structure": {"label": "Structural survey & reinforcement", "base": 80000, "rate": 2500}, "acoustic": {"label": "Acoustic floor isolation", "base": 0, "rate": 420}, "ventilation": {"label": "Heat & steam extraction", "base": 0, "rate": 18000}, "irrigation": {"label": "Irrigation & planting care", "base": 15000, "rate": 450}, "outlight": {"label": "Outdoor & landscape lighting", "base": 0, "rate": 90}, "drainage": {"label": "Outdoor drainage", "base": 0, "rate": 60}, "court": {"label": "Court lighting", "base": 0, "rate": 45000}, "sound": {"label": "Sound system", "base": 0, "rate": 85}, "access": {"label": "Access control & smart lockers", "base": 40000, "rate": 600}, "blinds": {"label": "Blinds & solar control", "base": 0, "rate": 1400}, "av": {"label": "Screens & AV system", "base": 45000, "rate": 0}, "scent": {"label": "Scent & air quality", "base": 18000, "rate": 0}}'::jsonb)
on conflict (id) do nothing;
