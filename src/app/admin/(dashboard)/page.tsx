import Link from "next/link";
import { addDays, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { formatCompactQAR, formatDateLabel, relativeDay, STAGE_LABEL } from "@/lib/admin/format";
import { Search, Bell, Plus } from "lucide-react";
import type { CalendarEvent, ProjectMilestone } from "@/types/database";

export const dynamic = "force-dynamic";

interface DueMilestone extends ProjectMilestone {
  projects: { id: string; name: string; location: string | null; stage: string } | null;
}

interface UpcomingEvent extends CalendarEvent {
  projects: { name: string; location: string | null } | null;
}

export default async function OverviewPage() {
  const supabase = await createClient();
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");
  const weekAheadISO = format(addDays(today, 7), "yyyy-MM-dd");

  const [
    { count: newEnquiryCount },
    { count: activeProjectCount },
    { data: weekEvents },
    { data: projects },
    { data: dueMilestones },
    { data: nextEvents },
  ] = await Promise.all([
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("calendar_events").select("event_type").gte("event_date", todayISO).lte("event_date", weekAheadISO),
    supabase.from("projects").select("stage, budget_value"),
    supabase
      .from("project_milestones")
      .select("*, projects(id, name, location, stage)")
      .eq("status", "due")
      .order("event_date", { ascending: true })
      .limit(4)
      .returns<DueMilestone[]>(),
    supabase
      .from("calendar_events")
      .select("*, projects(name, location)")
      .gte("event_date", todayISO)
      .order("event_date", { ascending: true })
      .limit(3)
      .returns<UpcomingEvent[]>(),
  ]);

  const pipelineValue = (projects ?? []).reduce((sum, p) => sum + (p.budget_value ?? 0), 0);

  const stageCounts: Record<string, number> = { consultation: 0, design: 0, build: 0, operations: 0 };
  (projects ?? []).forEach((p) => {
    stageCounts[p.stage] = (stageCounts[p.stage] ?? 0) + 1;
  });
  const totalProjects = projects?.length || 1;

  const visits = (weekEvents ?? []).filter((e) => e.event_type === "site_visit").length;
  const calls = (weekEvents ?? []).filter((e) => e.event_type === "call").length;
  const due = (weekEvents ?? []).filter((e) => e.event_type === "milestone").length;

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — WORKSPACE</div>
          <h1>Overview</h1>
        </div>
        <div className="topbar-actions">
          <div className="search">
            <Search size={13} strokeWidth={1.4} />
            <input type="text" placeholder="Search projects, clients…" />
          </div>
          <Link href="/admin/enquiries" className="icon-btn" title="Enquiries">
            <Bell size={15} strokeWidth={1.2} />
          </Link>
          <Link href="/admin/enquiries" className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={1.3} />
            NEW PROJECT
          </Link>
        </div>
      </header>

      <div className="content">
        <div className="between mb-24">
          <div>
            <p className="eyebrow mb-16">{format(today, "EEEE — d MMMM yyyy").toUpperCase()}</p>
            <h2 style={{ fontSize: 24, fontWeight: 200, letterSpacing: "0.04em" }}>Good day.</h2>
            <p className="muted tt-none mt-8" style={{ fontSize: 12 }}>
              You have <b style={{ color: "var(--olive)" }}>{newEnquiryCount ?? 0} new enquiries</b> and{" "}
              <b style={{ color: "var(--amber)" }}>{(dueMilestones ?? []).length} milestones due</b>.
            </p>
          </div>
        </div>

        <div className="grid grid-4 mb-40">
          <Link className="stat" href="/admin/enquiries">
            <div className="k">NEW ENQUIRIES</div>
            <div className="v">{newEnquiryCount ?? 0}</div>
            <div className="sub">AWAITING FIRST CONTACT</div>
            <div className="accent-line" style={{ width: "40%" }} />
          </Link>
          <Link className="stat" href="/admin/projects">
            <div className="k">ACTIVE PROJECTS</div>
            <div className="v">{activeProjectCount ?? 0}</div>
            <div className="sub">ACROSS 4 STAGES</div>
            <div className="accent-line" style={{ width: "70%" }} />
          </Link>
          <Link className="stat" href="/admin/calendar">
            <div className="k">THIS WEEK</div>
            <div className="v">
              {(weekEvents ?? []).length} <small>events</small>
            </div>
            <div className="sub">
              <span className="down">{due} DUE</span> · {visits} VISITS · {calls} CALLS
            </div>
            <div className="accent-line" style={{ width: "55%" }} />
          </Link>
          <div className="stat">
            <div className="k">PIPELINE VALUE</div>
            <div className="v tnum">
              {formatCompactQAR(pipelineValue)} <small>QAR</small>
            </div>
            <div className="sub">ACROSS ALL PROJECTS</div>
            <div className="accent-line" style={{ width: "85%" }} />
          </div>
        </div>

        <div className="grid cols-main">
          <div className="panel">
            <div className="panel-head">
              <h3>NEEDS ATTENTION</h3>
              <Link href="/admin/projects" className="label" style={{ color: "var(--olive)", letterSpacing: "0.2em" }}>
                ALL PROJECTS →
              </Link>
            </div>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Stage</th>
                    <th>What&apos;s needed</th>
                    <th className="right">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {(dueMilestones ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="tt-none muted">
                        Nothing needs attention right now.
                      </td>
                    </tr>
                  )}
                  {(dueMilestones ?? []).map((m) => (
                    <tr key={m.id} className="row-flag" >
                      <td>
                        <Link href={`/admin/projects/${m.projects?.id}`} className="primary" style={{ display: "block" }}>
                          {m.projects?.name}
                        </Link>
                        <span className="dim" style={{ fontSize: 8, letterSpacing: "0.15em" }}>
                          {m.projects?.location?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="pill pill-olive">
                          <span className="dot" />
                          {STAGE_LABEL[m.projects?.stage ?? "consultation"]}
                        </span>
                      </td>
                      <td className="tt-none muted">{m.title}</td>
                      <td className="right" style={{ color: "var(--amber)" }}>
                        {formatDateLabel(m.event_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="stack gap-24">
            <div className="panel panel-pad">
              <div className="label mb-24">JOBS BY STAGE</div>
              <div className="barline">
                {Object.entries(STAGE_LABEL).map(([key, label]) => (
                  <div className="barrow" key={key}>
                    <span className="bl">{label}</span>
                    <div className="track">
                      <div className="fill" style={{ width: `${((stageCounts[key] ?? 0) / totalProjects) * 100}%` }} />
                    </div>
                    <span className="bn">{stageCounts[key] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>NEXT UP</h3>
                <Link href="/admin/calendar" className="label" style={{ color: "var(--olive)" }}>
                  CALENDAR →
                </Link>
              </div>
              <div className="panel-pad" style={{ paddingTop: 20 }}>
                <div className="timeline">
                  {(nextEvents ?? []).length === 0 && <p className="dim tt-none">Nothing scheduled yet.</p>}
                  {(nextEvents ?? []).map((ev, i) => (
                    <div className={`tl-item${i === 0 ? " now" : ""}`} key={ev.id}>
                      <div className="d">
                        {relativeDay(ev.event_date)}
                        {ev.event_time ? ` · ${ev.event_time}` : ""}
                      </div>
                      <div className="h tt-none" style={{ letterSpacing: "0.04em" }}>
                        {ev.title}
                      </div>
                      <div className="p">{ev.projects?.location ?? ev.attendees ?? ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
