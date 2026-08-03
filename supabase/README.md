# Velora Admin — Supabase Setup

The admin dashboard at `/admin` is fully built and wired to Supabase. Two ways to run it: **locally with Docker** (fast, free, already set up on this machine) or against a **hosted Supabase project** (for staging/production).

## Option A — Local (Docker), already running on this machine

This is what `.env.local` is currently pointed at.

```bash
npx supabase start   # starts the local stack, applies migrations/ + seed.sql
npx supabase status  # reprints the URL/keys any time
npx supabase stop    # stop the containers when you're done
```

- **Studio (DB browser/editor):** http://127.0.0.1:55323
- **API URL:** http://127.0.0.1:55321
- Ports are non-default (553xx instead of 543xx) because another local Supabase project on this machine already uses the standard ports — see `supabase/config.toml` if you ever need to change them back.
- `npx supabase db reset` wipes and re-applies `migrations/` + `seed.sql` from scratch — use it any time the local data gets messy. **It also wipes Auth users**, so re-create your login after (see below).

### Create your local login

`supabase start`/`db reset` create an empty Auth store — the seeded `team_members` table is just a roster, it does **not** create sign-in credentials. Create one via the Auth Admin API (swap in your local `service_role` key from `npx supabase status`):

```bash
curl -X POST 'http://127.0.0.1:55321/auth/v1/admin/users' \
  -H "apikey: <service_role key>" \
  -H "Authorization: Bearer <service_role key>" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@velora.qa","password":"admin12345","email_confirm":true}'
```

Then sign in at `/admin/login` with that email/password. Using the same email as a seeded `team_members` row (`admin@velora.qa`) makes the sidebar show the real name/role instead of the raw email.

## Option B — Hosted project (for staging/production)

1. Go to https://supabase.com/dashboard and create a new project.
2. In **SQL Editor**, run everything in [`migrations/20260709113855_initial_schema.sql`](./migrations/20260709113855_initial_schema.sql), then everything in [`seed.sql`](./seed.sql) (seed data is optional but recommended so the dashboard isn't empty).
3. In **Project Settings → API**, copy the **Project URL** and **anon/public** key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
   Add the same two to Coolify's environment variables for the deployed site.
4. In **Authentication → Users → Add user**, create your login (check "Auto Confirm User"), using a seeded `team_members` email if you want your name/role to show correctly.

Or use the CLI to push the same local migrations to a hosted project instead of copy-pasting: `npx supabase link --project-ref <ref>` then `npx supabase db push`.

## What's already working

- **`/admin`** — Overview: live counts, overdue milestones, pipeline value, next-up calendar.
- **`/admin/enquiries`** — every contact-form submission lands here. Status pipeline (New → Contacted → Qualified → Converted → Archived), editable internal notes.
- **`/admin/enquiries/[id]/convert`** — turns an enquiry into a Project with one form.
- **`/admin/projects`** — kanban board (by stage) and table view, toggle between them.
- **`/admin/projects/[id]`** — full project detail: stage progress, milestone timeline, edit fields, publish to portfolio.
- **`/admin/calendar`** — month view of all site visits, calls, and milestones; click to edit or schedule new.
- **`/admin/portfolio`** — manage what's live on the public `/portfolio` page (the public page reads from Supabase, not a hardcoded array — edits here go live immediately, verified end-to-end).
- **`/admin/settings`** — team roster + invite (adds a pending row; doesn't yet send a real email invite, see below).
- **The public contact form** (`/contact`) really saves to the `enquiries` table.

## Known limitations (by design, not oversights)

- **Team invites don't send real emails.** `inviteTeamMember` only inserts a `team_members` row with `status='pending'`. Wiring a real Supabase Auth invite email requires the **service role key** server-side (`supabase.auth.admin.inviteUserByEmail()`) — ask if you want this wired up.
- **No image upload.** Portfolio before/after images are plain text inputs for a path or URL, not a file uploader. Supabase Storage would be the natural next step.
- **Pipeline stages are fixed.** Consultation → Design → Build → Operations is a Postgres enum, not an editable list — Settings shows it as a labeled reference, not a fake editable UI.
- **`/admin` needs Supabase configured to load at all**, including the login page itself. The public site (`/`, `/portfolio`, `/contact`, etc.) works completely independently of Supabase and degrades gracefully (never 500s) if these env vars are missing.

## Schema notes for whoever edits `migrations/` next

- **RLS policies are not enough on their own.** Postgres requires base table-level `GRANT`s before a role can touch a table at all, separate from row-level policies. The migration ends with an explicit `grant ... to anon, authenticated, service_role` block — hosted Supabase pre-configures this for tables made via their dashboard, but a raw SQL migration (local CLI or a manually-run hosted SQL Editor script) does not get it for free. Found and fixed via local testing — don't remove that block.
- **Enum columns inside `UNION ALL` seeds need explicit casts** (e.g. `'done'::milestone_status`, `'2026-07-11'::date`). A bare string literal across a `UNION ALL` resolves to `text` before the enclosing `INSERT` can coerce it to the target enum/date type, and Postgres won't implicitly cast text → enum. Plain multi-row `VALUES (...)` inserts don't have this problem — only the `SELECT ... UNION ALL SELECT ...` pattern used for `project_milestones` and `calendar_events` seeding.
