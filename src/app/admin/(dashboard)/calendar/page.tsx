import { createClient } from "@/lib/supabase/server";
import { endOfMonth, endOfWeek, format, parse, startOfMonth, startOfWeek } from "date-fns";
import type { CalendarEvent, Project } from "@/types/database";
import CalendarClient from "./CalendarClient";

export const dynamic = "force-dynamic";

export interface CalendarEventWithProject extends CalendarEvent {
  projects: { name: string; location: string | null } | null;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const monthDate = month ? parse(month, "yyyy-MM", new Date()) : new Date();
  const monthLabel = format(monthDate, "yyyy-MM");

  const rangeStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });

  const supabase = await createClient();

  const [{ data: events }, { data: projects }] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*, projects(name, location)")
      .gte("event_date", format(rangeStart, "yyyy-MM-dd"))
      .lte("event_date", format(rangeEnd, "yyyy-MM-dd"))
      .order("event_date", { ascending: true })
      .returns<CalendarEventWithProject[]>(),
    supabase
      .from("projects")
      .select("id, name")
      .order("name", { ascending: true })
      .returns<Pick<Project, "id" | "name">[]>(),
  ]);

  return <CalendarClient month={monthLabel} events={events ?? []} projects={projects ?? []} />;
}
