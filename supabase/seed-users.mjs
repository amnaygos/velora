/**
 * Seeds Auth users + their team_members rows for the two roles.
 * Idempotent: updates the user if the email already exists.
 *
 *   node supabase/seed-users.mjs
 *
 * The permission-critical bit is `app_metadata.app_role` — RLS and the
 * middleware both read the role from the JWT, and app_metadata is the only
 * user-settable claim a user cannot change themselves.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "http://127.0.0.1:55321";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  {
    email: "admin@velora.qa",
    password: "admin12345",
    name: "Admin",
    role: "Principal",
    app_role: "manager",
  },
  {
    email: "manager@velora.qa",
    password: "manager12345",
    name: "Maya Rahman",
    role: "Studio Manager",
    app_role: "manager",
  },
  {
    email: "sales@velora.qa",
    password: "sales12345",
    name: "Yara Salem",
    role: "Sales Agent",
    app_role: "sales",
  },
];

async function findUserByEmail(email) {
  // listUsers is paginated; this project has a handful of users so page 1 is enough.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => u.email === email) || null;
}

async function main() {
  for (const u of USERS) {
    const existing = await findUserByEmail(u.email);
    const app_metadata = { app_role: u.app_role };

    let userId;
    if (existing) {
      const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
        password: u.password,
        email_confirm: true,
        app_metadata,
      });
      if (error) throw error;
      userId = data.user.id;
      console.log(`  ~ updated ${u.email} (${u.app_role})`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        app_metadata,
      });
      if (error) throw error;
      userId = data.user.id;
      console.log(`  + created ${u.email} (${u.app_role})`);
    }

    // Upsert the roster row (email is unique). Links user_id + mirrors app_role.
    const { error: rowErr } = await supabase
      .from("team_members")
      .upsert(
        {
          user_id: userId,
          name: u.name,
          email: u.email,
          role: u.role,
          access: u.app_role === "manager" ? "admin" : "editor",
          status: "active",
          app_role: u.app_role,
        },
        { onConflict: "email" }
      );
    if (rowErr) throw rowErr;
  }

  console.log("\nDone. Credentials:");
  for (const u of USERS) console.log(`  ${u.app_role.padEnd(8)} ${u.email}  /  ${u.password}`);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
