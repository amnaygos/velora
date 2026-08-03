import { createClient } from "@/lib/supabase/server";
import type { Enquiry } from "@/types/database";
import { roleFromUser } from "@/lib/admin/rbac";
import EnquiriesClient, { type TeamOption } from "./EnquiriesClient";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const appRole = roleFromUser(user);

  const [{ data: enquiries }, { data: team }] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Enquiry[]>(),
    supabase
      .from("team_members")
      .select("id, name, app_role, email")
      .order("name", { ascending: true })
      .returns<TeamOption[]>(),
  ]);

  const currentMemberId =
    (team ?? []).find((m) => m.email === user?.email)?.id ?? null;

  return (
    <EnquiriesClient
      enquiries={enquiries ?? []}
      team={team ?? []}
      appRole={appRole}
      currentMemberId={currentMemberId}
    />
  );
}
