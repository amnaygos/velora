"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDateLong } from "@/lib/admin/format";
import type { Enquiry, ProjectStage, TeamMember } from "@/types/database";
import { convertEnquiryToProject } from "./actions";

const BUDGET_OPTIONS = [
  "Under QAR 500,000",
  "QAR 500,000 – 2,000,000",
  "QAR 2,000,000 – 5,000,000",
  "QAR 5,000,000 +",
  "Not yet defined",
];

const STAGE_OPTIONS: { value: ProjectStage; label: string }[] = [
  { value: "consultation", label: "Consultation" },
  { value: "design", label: "Design" },
  { value: "build", label: "Build" },
  { value: "operations", label: "Operations" },
];

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ConvertClient({
  enquiry,
  teamMembers,
}: {
  enquiry: Enquiry;
  teamMembers: TeamMember[];
}) {
  const [stage, setStage] = useState<ProjectStage>("consultation");
  const [scheduleCall, setScheduleCall] = useState(true);

  const convertAction = convertEnquiryToProject.bind(null, enquiry.id);

  const clientName = enquiry.name || "New lead";
  const projectType = enquiry.project_type || "";
  const defaultProjectName = enquiry.company
    ? `${enquiry.company} — ${projectType}`.trim().replace(/—\s*$/, "").trim()
    : `${clientName} — ${projectType}`.trim().replace(/—\s*$/, "").trim();

  const initialBudget = enquiry.budget_range && BUDGET_OPTIONS.includes(enquiry.budget_range) ? enquiry.budget_range : "";

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">
            <Link href="/admin/enquiries" style={{ color: "var(--olive)" }}>
              ENQUIRIES
            </Link>{" "}
            — CONVERT
          </div>
          <h1>New Project from Enquiry</h1>
        </div>
        <div className="topbar-actions">
          <Link href="/admin/enquiries" className="btn btn-ghost btn-sm">
            CANCEL
          </Link>
          <button type="submit" form="convert-form" className="btn btn-primary btn-sm">
            CREATE PROJECT
            <ArrowRight size={13} strokeWidth={1.3} />
          </button>
        </div>
      </header>

      <div className="content">
        {/* Source enquiry banner */}
        <div className="panel panel-pad mb-40" style={{ borderLeft: "2px solid var(--olive)" }}>
          <div className="between">
            <div className="flex items-center gap-16">
              <div className="avatar avatar-lg avatar-olive">{initialsFor(clientName)}</div>
              <div>
                <div className="eyebrow mb-16">CONVERTING ENQUIRY · RECEIVED {formatDateLong(enquiry.created_at)}</div>
                <div style={{ fontSize: 15, fontWeight: 300, letterSpacing: "0.04em" }}>
                  {clientName}{projectType ? ` — ${projectType}` : ""}
                </div>
                <div className="dim tt-none mt-8" style={{ fontSize: 11 }}>
                  {enquiry.email || "—"} · {enquiry.phone || "—"} · {enquiry.company || "—"}
                </div>
              </div>
            </div>
            <span className="pill pill-olive">FIELDS PRE-FILLED FROM ENQUIRY</span>
          </div>
        </div>

        <form id="convert-form" action={convertAction}>
          <input type="hidden" name="client_email" value={enquiry.email ?? ""} />
          <input type="hidden" name="client_phone" value={enquiry.phone ?? ""} />
          <input type="hidden" name="stage" value={stage} />

          <div className="grid cols-main">
            {/* Left: form */}
            <div className="panel panel-pad">
              <div className="section-head mb-40">
                <span className="eyebrow">PROJECT DETAILS</span>
              </div>

              <div className="field">
                <label>
                  Project Name <span className="req">*</span>
                </label>
                <input type="text" name="name" defaultValue={defaultProjectName} required />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>
                    Client <span className="req">*</span>
                  </label>
                  <input type="text" name="client_name" defaultValue={clientName} required />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input type="text" name="company" defaultValue={enquiry.company ?? ""} />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Project Type</label>
                  <input type="text" name="project_type" defaultValue={projectType} />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input type="text" name="location" placeholder="e.g. Lusail Marina, Qatar" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Budget Range</label>
                  <select name="budget_range" defaultValue={initialBudget}>
                    <option value="">Select budget range…</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Target Completion</label>
                  <input type="text" name="target_completion" placeholder="e.g. Q3 2027" />
                </div>
              </div>

              <div className="divider-h" />

              <div className="section-head mb-24">
                <span className="eyebrow">STARTING STAGE</span>
              </div>
              <div className="choice-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                {STAGE_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`choice${stage === s.value ? " sel" : ""}`}
                    onClick={() => setStage(s.value)}
                  >
                    <span className="box" />
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="field mt-40" style={{ marginBottom: 0 }}>
                <label>Brief (carried from enquiry)</label>
                <textarea className="tt-none" name="brief" defaultValue={enquiry.message ?? ""} rows={5} />
              </div>
            </div>

            {/* Right: assignment + first schedule */}
            <div className="stack gap-24">
              <div className="panel panel-pad">
                <div className="label mb-24">ASSIGN TEAM</div>
                <div className="field">
                  <label>Lead Principal</label>
                  <select name="lead_principal" defaultValue="">
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Designer</label>
                  <select name="designer" defaultValue="">
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="panel panel-pad">
                <div className="label mb-24">SCHEDULE FIRST STEP</div>
                <div className="field">
                  <label>Discovery Call</label>
                  <input type="text" placeholder="e.g. Fri 10 Jul · 11:00" />
                </div>
                <button
                  type="button"
                  className={`choice${scheduleCall ? " sel" : ""}`}
                  style={{ width: "100%" }}
                  onClick={() => setScheduleCall((v) => !v)}
                >
                  <span className="box" />
                  Add to calendar &amp; email client
                </button>
              </div>

              <div className="panel panel-pad" style={{ background: "var(--olive-06)", borderColor: "var(--olive-30)" }}>
                <div className="eyebrow mb-16">WHAT HAPPENS NEXT</div>
                <p className="tt-none dim" style={{ fontSize: 11, lineHeight: 1.9 }}>
                  The enquiry is marked <b style={{ color: "var(--olive)" }}>Converted</b>, and a Project card
                  appears in <b style={{ color: "var(--white)" }}>Consultation</b> — ready for scheduling from
                  the <b style={{ color: "var(--white)" }}>Calendar</b>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
