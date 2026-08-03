import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry, TeamMember } from "@/types/database";
import { roleFromUser } from "@/lib/admin/rbac";
import ConvertClient from "./ConvertClient";

export const dynamic = "force-dynamic";

export default async function ConvertEnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Converting creates a project — a manager-only action (also enforced by
  // RLS). Sales reaching this route (it lives under /admin/enquiries) is
  // bounced back to the list rather than shown a form that can't submit.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (roleFromUser(user) !== "manager") {
    redirect("/admin/enquiries");
  }

  const [{ data: enquiries }, { data: teamMembers }] = await Promise.all([
    supabase.from("enquiries").select("*").eq("id", id).returns<Enquiry[]>(),
    supabase
      .from("team_members")
      .select("*")
      .in("access", ["admin", "editor"])
      .eq("status", "active")
      .order("name", { ascending: true })
      .returns<TeamMember[]>(),
  ]);

  const enquiry = enquiries?.[0];

  if (!enquiry) {
    notFound();
  }

  return <ConvertClient enquiry={enquiry} teamMembers={teamMembers ?? []} />;
}
