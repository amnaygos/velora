import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";
import type { TeamMember } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  const teamMembers = (data ?? []) as TeamMember[];
  const currentEmail = user?.email ?? null;

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — SYSTEM</div>
          <h1>Settings</h1>
        </div>
      </header>

      <div className="content">
        <SettingsClient
          teamMembers={teamMembers}
          currentEmail={currentEmail}
        />
      </div>
    </>
  );
}
