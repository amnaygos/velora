"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEventType } from "@/types/database";

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const eventType = String(formData.get("event_type") || "site_visit") as CalendarEventType;
  const eventDate = String(formData.get("event_date") || "").trim();
  const eventTime = String(formData.get("event_time") || "").trim();
  const projectId = String(formData.get("project_id") || "").trim();
  const attendees = String(formData.get("attendees") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  return {
    title,
    event_type: eventType,
    event_date: eventDate,
    event_time: eventTime || null,
    project_id: projectId && projectId !== "none" ? projectId : null,
    attendees: attendees || null,
    notes: notes || null,
  };
}

export async function createCalendarEvent(formData: FormData) {
  const supabase = await createClient();
  const fields = readEventFields(formData);

  await supabase.from("calendar_events").insert(fields);

  revalidatePath("/admin/calendar");
  revalidatePath("/admin");
}

export async function updateCalendarEvent(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = readEventFields(formData);

  await supabase.from("calendar_events").update(fields).eq("id", id);

  revalidatePath("/admin/calendar");
  revalidatePath("/admin");
}

export async function deleteCalendarEvent(id: string) {
  const supabase = await createClient();

  await supabase.from("calendar_events").delete().eq("id", id);

  revalidatePath("/admin/calendar");
  revalidatePath("/admin");
}
