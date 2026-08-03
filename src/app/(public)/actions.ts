"use server";

import { createClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validation";
import type { EnquiryFormValues } from "@/types/forms";

export type PublicEnquiryResult = { ok: boolean; error?: string };

/**
 * Public enquiry form → Supabase `enquiries` table. Runs as the anon role
 * (the visitor has no session), which the "public can submit enquiries" RLS
 * policy allows for INSERT only. The lead then appears in the admin inbox.
 */
export async function submitPublicEnquiry(
  values: EnquiryFormValues
): Promise<PublicEnquiryResult> {
  // Re-validate on the server — never trust the client.
  const parsed = enquirySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    name: v.fullName,
    email: v.email,
    phone: v.phone,
    company: v.company || null,
    project_type: v.projectType,
    budget_range: v.budget,
    source: v.source,
    message: v.vision,
  });

  if (error) {
    return { ok: false, error: "Your enquiry couldn't be sent. Please try again or email us." };
  }
  return { ok: true };
}
