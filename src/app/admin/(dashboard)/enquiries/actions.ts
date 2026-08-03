"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/types/database";

function revalidate() {
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const supabase = await createClient();
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidate();
}

export async function updateEnquiryNote(id: string, note: string) {
  const supabase = await createClient();
  await supabase.from("enquiries").update({ internal_note: note || null }).eq("id", id);
  revalidate();
}

export async function archiveEnquiry(id: string) {
  const supabase = await createClient();
  await supabase.from("enquiries").update({ status: "archived" }).eq("id", id);
  revalidate();
}

/** Assign (or clear, with null) an enquiry to a team member. */
export async function assignEnquiry(id: string, memberId: string | null) {
  const supabase = await createClient();
  await supabase.from("enquiries").update({ assigned_to: memberId }).eq("id", id);
  revalidate();
}

/**
 * Self-assign: looks up the signed-in user's team_members row and claims the
 * enquiry. Lets a sales agent take a lead without needing the full roster.
 */
export async function claimEnquiry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return;

  const { data: rows } = await supabase
    .from("team_members")
    .select("id")
    .eq("email", user.email)
    .returns<{ id: string }[]>();

  const memberId = rows?.[0]?.id;
  if (!memberId) return;

  await supabase.from("enquiries").update({ assigned_to: memberId }).eq("id", id);
  revalidate();
}
