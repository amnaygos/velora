"use server";

import { createClient } from "@/lib/supabase/server";
import { blueprintSchema, enquirySchema, newsletterSchema } from "@/lib/validation";
import type { BlueprintFormValues, EnquiryFormValues, NewsletterFormValues } from "@/types/forms";

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

/**
 * Wellness Blueprint download → a lead in the admin inbox (enquiries), so the
 * studio can follow up with the people who asked for it.
 */
export async function requestBlueprint(values: BlueprintFormValues): Promise<PublicEnquiryResult> {
  const parsed = blueprintSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    name: v.fullName,
    email: v.email,
    source: "Wellness Blueprint",
    message: `Downloaded the Wellness Blueprint. Role: ${v.role}.`,
  });

  if (error) {
    return { ok: false, error: "Your request couldn't be sent. Please try again." };
  }
  return { ok: true };
}

/**
 * The Velora Edit sign-up → subscribers. Anon may only insert; signing up
 * twice with the same address counts as success, not an error.
 */
export async function subscribeToEdit(values: NewsletterFormValues): Promise<PublicEnquiryResult> {
  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({
    email: v.email.trim(),
    role: v.role?.trim() || null,
    source: "The Velora Edit",
  });

  if (error && error.code !== "23505") {
    return { ok: false, error: "Your subscription couldn't be saved. Please try again." };
  }
  return { ok: true };
}
