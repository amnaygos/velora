/**
 * Creates (or resets) an admin login and its team row.
 *
 *   node supabase/create-user.mjs <email> <password> "<Full Name>" [manager|sales]
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 * (or the environment). The role lives in app_metadata.app_role, the only
 * claim a user can't change themselves; RLS and the middleware both read it.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = { ...process.env };
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && !line.startsWith("#") && !env[line.slice(0, i)]) env[line.slice(0, i)] = line.slice(i + 1).trim();
  }
}

const [email, password, name, role = "manager"] = process.argv.slice(2);
if (!email || !password || !name || !["manager", "sales"].includes(role)) {
  console.error('Usage: node supabase/create-user.mjs <email> <password> "<Full Name>" [manager|sales]');
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
if (listErr) throw listErr;
const existing = list.users.find((u) => u.email === email);
const app_metadata = { app_role: role };

const { data, error } = existing
  ? await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true, app_metadata })
  : await supabase.auth.admin.createUser({ email, password, email_confirm: true, app_metadata });
if (error) throw error;

const { error: rowErr } = await supabase.from("team_members").upsert(
  { user_id: data.user.id, name, email, role: role === "manager" ? "Manager" : "Sales", access: role === "manager" ? "admin" : "editor", status: "active", app_role: role },
  { onConflict: "email" }
);
if (rowErr) throw rowErr;

console.log(`${existing ? "Updated" : "Created"} ${email} (${role}).`);
