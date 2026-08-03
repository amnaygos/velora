import type { AppRole } from "@/types/database";

/** The one place that defines what each role may reach. */
export const ROLE_HOME: Record<AppRole, string> = {
  manager: "/admin",
  sales: "/admin/enquiries",
};

/** Path prefixes a role is allowed to visit (besides /admin/login). */
const ALLOWED_PREFIXES: Record<AppRole, string[]> = {
  // Managers can go anywhere under /admin.
  manager: ["/admin"],
  // Sales are confined to the enquiries section.
  sales: ["/admin/enquiries"],
};

export function roleCanAccess(role: AppRole, pathname: string): boolean {
  if (pathname === "/admin/login") return true;
  return ALLOWED_PREFIXES[role].some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/** Read the permission role off a Supabase user's app_metadata. */
export function roleFromUser(user: { app_metadata?: Record<string, unknown> } | null | undefined): AppRole {
  return user?.app_metadata?.app_role === "sales" ? "sales" : "manager";
}
