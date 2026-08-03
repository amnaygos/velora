import { createBrowserClient } from "@supabase/ssr";

/**
 * No <Database> generic: our hand-written types/database.ts interfaces
 * don't include the `Relationships` metadata Supabase's select-string
 * type parser needs (that's only accurate once generated via
 * `supabase gen types typescript` against a real, linked project).
 * Type query results explicitly at the call site instead, e.g.
 * `.select("name, role").returns<Pick<TeamMember, "name" | "role">[]>()`.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
