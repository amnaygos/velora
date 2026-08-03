"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { roleFromUser } from "@/lib/admin/rbac";
import type { AppRole } from "@/types/database";

export type ActionResult = { ok: boolean; error?: string };

/** All user-management is manager-only. Verify the caller before touching Auth. */
async function assertManager(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Not signed in.";
  if (roleFromUser(user) !== "manager") return "Managers only.";
  return null;
}

function normalizeRole(raw: string): AppRole {
  return raw === "sales" ? "sales" : "manager";
}

async function findAuthUserByEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  return data?.users.find((u) => u.email === email) ?? null;
}

/**
 * Creates a real Auth user (so they can sign in) with the chosen role baked
 * into app_metadata, plus a matching team_members row. The manager sets a
 * temporary password to hand over.
 */
export async function inviteTeamMember(formData: FormData): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const jobTitle = String(formData.get("role") || "").trim();
  const appRole = normalizeRole(String(formData.get("app_role") || "sales"));
  const password = String(formData.get("password") || "").trim();

  if (!email) return { ok: false, error: "Email is required." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const admin = createAdminClient();

  if (await findAuthUserByEmail(admin, email)) {
    return { ok: false, error: "A user with that email already exists." };
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { app_role: appRole },
  });
  if (createErr || !created.user) {
    return { ok: false, error: createErr?.message ?? "Could not create the user." };
  }

  const { error: rowErr } = await admin.from("team_members").upsert(
    {
      user_id: created.user.id,
      name: name || email,
      email,
      role: jobTitle || (appRole === "manager" ? "Manager" : "Sales Agent"),
      access: appRole === "manager" ? "admin" : "editor",
      status: "active",
      app_role: appRole,
    },
    { onConflict: "email" }
  );
  if (rowErr) return { ok: false, error: rowErr.message };

  revalidatePath("/admin/settings");
  return { ok: true };
}

/** Change a member's permission role — updates both the JWT source (Auth
 *  app_metadata) and the roster row so the two never drift. */
export async function updateMemberRole(memberId: string, appRole: AppRole): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };

  const admin = createAdminClient();

  const { data: rows } = await admin
    .from("team_members")
    .select("email")
    .eq("id", memberId)
    .returns<{ email: string }[]>();
  const email = rows?.[0]?.email;
  if (!email) return { ok: false, error: "Member not found." };

  const authUser = await findAuthUserByEmail(admin, email);
  if (authUser) {
    const { error } = await admin.auth.admin.updateUserById(authUser.id, {
      app_metadata: { app_role: appRole },
    });
    if (error) return { ok: false, error: error.message };
  }

  await admin
    .from("team_members")
    .update({ app_role: appRole, access: appRole === "manager" ? "admin" : "editor" })
    .eq("id", memberId);

  revalidatePath("/admin/settings");
  return { ok: true };
}

/** Remove a member: deletes their Auth user (if any) and their roster row. */
export async function removeMember(memberId: string): Promise<ActionResult> {
  const guard = await assertManager();
  if (guard) return { ok: false, error: guard };

  const admin = createAdminClient();

  const { data: rows } = await admin
    .from("team_members")
    .select("email")
    .eq("id", memberId)
    .returns<{ email: string }[]>();
  const email = rows?.[0]?.email;

  if (email) {
    const authUser = await findAuthUserByEmail(admin, email);
    if (authUser) await admin.auth.admin.deleteUser(authUser.id);
  }
  await admin.from("team_members").delete().eq("id", memberId);

  revalidatePath("/admin/settings");
  return { ok: true };
}
