"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { CalendarEventType } from "@/types/database";
import type { CalendarEventWithProject } from "./page";
import { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from "./actions";

const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const EVENT_TYPE_OPTIONS: { value: CalendarEventType; label: string }[] = [
  { value: "site_visit", label: "Site Visit" },
  { value: "call", label: "Discovery Call" },
  { value: "milestone", label: "Milestone / Due Date" },
  { value: "internal", label: "Internal Review" },
];

const EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  site_visit: "SITE VISIT",
  call: "DISCOVERY CALL",
  milestone: "MILESTONE / DUE DATE",
  internal: "INTERNAL REVIEW",
};

function evClass(type: CalendarEventType): string {
  if (type === "site_visit") return "visit";
  if (type === "milestone") return "due";
  return "call";
}

type DrawerState = { mode: "new"; date: string } | { mode: "edit"; event: CalendarEventWithProject };

interface CalendarClientProps {
  month: string;
  events: CalendarEventWithProject[];
  projects: { id: string; name: string }[];
}

export default function CalendarClient({ month, events, projects }: CalendarClientProps) {
  const router = useRouter();
  const monthDate = parse(month, "yyyy-MM", new Date());

  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawer(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rangeStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const eventsByDate = new Map<string, CalendarEventWithProject[]>();
  events.forEach((ev) => {
    const list = eventsByDate.get(ev.event_date) ?? [];
    list.push(ev);
    eventsByDate.set(ev.event_date, list);
  });

  function goToMonth(d: Date) {
    router.push(`/admin/calendar?month=${format(d, "yyyy-MM")}`);
  }

  function defaultNewDate(): string {
    const today = new Date();
    if (isSameMonth(today, monthDate)) return format(today, "yyyy-MM-dd");
    return format(startOfMonth(monthDate), "yyyy-MM-dd");
  }

  function openNew(date?: string) {
    setDrawer({ mode: "new", date: date ?? defaultNewDate() });
  }

  function openEdit(event: CalendarEventWithProject) {
    setDrawer({ mode: "edit", event });
  }

  function closeDrawer() {
    setDrawer(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!drawer) return;
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    try {
      if (drawer.mode === "new") {
        await createCalendarEvent(formData);
      } else {
        await updateCalendarEvent(drawer.event.id, formData);
      }
      router.refresh();
      setDrawer(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!drawer || drawer.mode !== "edit") return;
    setSaving(true);
    try {
      await deleteCalendarEvent(drawer.event.id);
      router.refresh();
      setDrawer(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — WORKSPACE</div>
          <h1>Calendar</h1>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => openNew()}>
            <Plus size={13} strokeWidth={1.3} />
            SCHEDULE
          </button>
        </div>
      </header>

      <div className="content">
        <div className="cal-head">
          <div className="cal-nav">
            <button className="icon-btn" onClick={() => goToMonth(subMonths(monthDate, 1))}>
              <ChevronLeft size={15} strokeWidth={1.3} />
            </button>
            <span className="mo">{format(monthDate, "MMMM yyyy").toUpperCase()}</span>
            <button className="icon-btn" onClick={() => goToMonth(addMonths(monthDate, 1))}>
              <ChevronRight size={15} strokeWidth={1.3} />
            </button>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={() => goToMonth(new Date())}>
              TODAY
            </button>
          </div>
          <div className="legend">
            <div className="li">
              <span className="sw" style={{ background: "var(--olive)" }} />
              SITE VISIT
            </div>
            <div className="li">
              <span className="sw" style={{ background: "var(--w40)" }} />
              CALL
            </div>
            <div className="li">
              <span className="sw" style={{ background: "var(--amber)" }} />
              MILESTONE / DUE
            </div>
          </div>
        </div>

        <div className="cal-grid">
          {DOW.map((d) => (
            <div className="cal-dow" key={d}>
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dateStr) ?? [];
            const out = !isSameMonth(day, monthDate);
            const isTodayCell = isToday(day);
            return (
              <div
                key={dateStr}
                className={`cal-cell${out ? " out" : ""}${isTodayCell ? " today" : ""}`}
                onClick={() => openNew(dateStr)}
              >
                <span className="dn">{format(day, "d")}</span>
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`cal-ev ${evClass(ev.event_type)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(ev);
                    }}
                  >
                    {ev.event_time ? `${ev.event_time} ` : ""}
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {drawer && (
        <>
          <div className="overlay open" onClick={closeDrawer} />
          <aside className="drawer open">
            <form key={drawer.mode === "edit" ? drawer.event.id : "new"} onSubmit={handleSubmit}>
              <div className="drawer-head">
                <div>
                  <div className="eyebrow mb-16">
                    {drawer.mode === "new" ? "NEW" : `${EVENT_TYPE_LABEL[drawer.event.event_type]} · EDITABLE`}
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>
                    {drawer.mode === "new" ? "Schedule Event" : drawer.event.title}
                  </h2>
                </div>
                <button type="button" className="icon-btn" onClick={closeDrawer}>
                  <X size={15} strokeWidth={1.3} />
                </button>
              </div>
              <div className="drawer-body">
                <div className="field">
                  <label>
                    Title {drawer.mode === "new" && <span className="req">*</span>}
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Site visit — …"
                    defaultValue={drawer.mode === "edit" ? drawer.event.title : ""}
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Date</label>
                    <input
                      type="text"
                      name="event_date"
                      placeholder="yyyy-mm-dd"
                      defaultValue={drawer.mode === "edit" ? drawer.event.event_date : drawer.date}
                    />
                  </div>
                  <div className="field">
                    <label>Time</label>
                    <input
                      type="text"
                      name="event_time"
                      placeholder="00:00"
                      defaultValue={drawer.mode === "edit" ? drawer.event.event_time ?? "" : ""}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Type</label>
                  <select
                    name="event_type"
                    defaultValue={drawer.mode === "edit" ? drawer.event.event_type : "site_visit"}
                  >
                    {EVENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Linked Project</label>
                  <select
                    name="project_id"
                    defaultValue={drawer.mode === "edit" ? drawer.event.project_id ?? "none" : "none"}
                  >
                    <option value="none">— None —</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Attendees</label>
                  <input
                    type="text"
                    name="attendees"
                    className="tt-none"
                    defaultValue={drawer.mode === "edit" ? drawer.event.attendees ?? "" : ""}
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    className="tt-none"
                    defaultValue={drawer.mode === "edit" ? drawer.event.notes ?? "" : ""}
                  />
                </div>
              </div>
              <div className="drawer-foot">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  style={{ justifyContent: "center" }}
                  disabled={saving}
                >
                  {drawer.mode === "new" ? "ADD TO CALENDAR" : "SAVE CHANGES"}
                </button>
                {drawer.mode === "edit" && (
                  <button type="button" className="btn btn-outline" onClick={handleDelete} disabled={saving}>
                    DELETE
                  </button>
                )}
              </div>
            </form>
          </aside>
        </>
      )}
    </>
  );
}
