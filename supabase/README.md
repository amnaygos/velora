# Velora — Supabase

The public website and the admin at `/admin` share one Supabase database. The site reads its case studies, testimonials and studio details from it; the admin edits them, and an edit is live on the site's next request.

## Local (Docker), already running on this machine

This is what `.env.local` points at.

```bash
npx supabase start   # starts the local stack, applies migrations/
npx supabase status  # reprints the URL/keys any time
npx supabase stop    # stop the containers when you're done
```

- **Studio (DB browser/editor):** http://127.0.0.1:57323
- **API URL:** http://127.0.0.1:57321
- Ports are non-default (573xx) because other local Supabase projects on this machine already use 543xx and 553xx — see `supabase/config.toml`.
- `npx supabase db reset` wipes everything and re-applies `migrations/`. The website content comes back (it ships in a migration); enquiries, projects and **logins do not** — create your login again (below).

### Create a login

```bash
node supabase/create-user.mjs you@example.com "a-strong-password" "Your Name"          # manager
node supabase/create-user.mjs sales@example.com "a-strong-password" "Their Name" sales # sales seat
```

It reads the URL and service-role key from `.env.local`, and also resets the password of an existing login. Managers can add further users from **Admin → Settings**.

## Hosted project (staging / production)

1. Create a project at https://supabase.com/dashboard.
2. Push the migrations: `npx supabase link --project-ref <ref>` then `npx supabase db push`. This creates the schema **and** loads the website's content (14 case studies, the testimonials, the studio details).
3. In **Project Settings → API**, copy the Project URL, the anon key and the service-role key into the deployment's environment (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Create your login with `create-user.mjs` pointed at the hosted project (set the two variables in the shell first).

If the hosted project was ever loaded with the old demo `seed.sql`, `20261021130000_remove_demo_data.sql` removes those records on push. The old demo logins (`admin@velora.qa`, `manager@velora.qa`, `sales@velora.qa`) had their passwords in this repo — delete them in **Authentication → Users** if they exist there.

## What lives where

| Admin | Table | On the public site |
| --- | --- | --- |
| Enquiries | `enquiries` | Contact form, AI concierge, Wellness Blueprint downloads |
| Projects, Calendar | `projects`, `project_milestones`, `project_media`, `calendar_events` | — (internal) |
| Portfolio | `portfolio_items` | /portfolio, every case study, Selected Work and the before/after chapter on the home page, sitemap |
| Website | `site_settings`, `testimonials`, `subscribers` | Footer, menu, contact page, map, About/home figures, home testimonial, WhatsApp and AI buttons, The Velora Edit sign-ups |
| Space Canvas | `canvas_materials`, `canvas_equipment`, `canvas_spaces`, `canvas_space_items`, `canvas_features`, `canvas_settings` | The configurator at /space-canvas (reads `/api/space-canvas`) |
| Settings | `team_members` + Auth | — |

- **Images** in a case study are either the id of a photo already in `public/media` (see `src/content/mediaRegistry.ts`) or a photo uploaded from the admin to the public `site-media` bucket. Uploads carry their size and description in the URL fragment (`…/photo.webp#w=1600&h=1067&alt=…`); see `parseMediaRef` in `src/lib/media.ts`.
- **The home page:** Selected Work shows the case studies marked *Feature on the home page*; the before/after chapter below it shows the next two case studies that have a before & after, in portfolio order.
- **Fixed brand copy** (manifesto, services, consultancy, navigation) stays in `src/content/` — it is part of the design, not data.

## Access

- `manager` — everything. `sales` — enquiries only. Enforced three ways: RLS on every table (keyed off `app_metadata.app_role` in the JWT), the middleware, and the sidebar.
- Visitors (anon) may **read** only what is published, and may only **insert** an enquiry or a subscription — never read one back.

## Schema notes for whoever edits `migrations/` next

- **RLS policies are not enough on their own.** Postgres needs table-level `GRANT`s before a role can touch a table at all. Raw SQL migrations don't get the grants Supabase's dashboard adds, so each migration grants explicitly — don't remove those lines.
- **Cache tags.** The public site reads through `unstable_cache` with the tags in `src/lib/website.ts` and `src/lib/siteSettings.ts`. Any admin action that changes public content must call `updateTag(...)` for the matching tag, or the site keeps the old content for up to five minutes.
