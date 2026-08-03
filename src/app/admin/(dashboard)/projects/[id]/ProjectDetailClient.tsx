"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import {
  formatCompactQAR,
  formatDateLabel,
  formatDateLong,
  isOverdue,
  CATEGORY_LABEL,
  STAGE_LABEL,
} from "@/lib/admin/format";
import type { Project, ProjectMedia, ProjectMilestone, ProjectStage } from "@/types/database";
import { updateProjectFields, addMilestone, publishToPortfolio } from "./actions";
import ProjectMediaGallery from "./ProjectMediaGallery";

const STAGE_ORDER: ProjectStage[] = ["consultation", "design", "build", "operations"];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectDetailClient({
  project,
  milestones,
  media,
  enquiry,
}: {
  project: Project;
  milestones: ProjectMilestone[];
  media: ProjectMedia[];
  enquiry: { name: string; email: string } | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [savingFields, setSavingFields] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [savingMilestone, setSavingMilestone] = useState(false);

  const currentStageIndex = STAGE_ORDER.indexOf(project.stage);

  const nextDue = milestones
    .filter((m) => m.status === "due")
    .sort((a, b) => {
      if (!a.event_date) return 1;
      if (!b.event_date) return -1;
      return a.event_date.localeCompare(b.event_date);
    })[0];

  async function handleSaveFields(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingFields(true);
    const formData = new FormData(e.currentTarget);
    await updateProjectFields(project.id, formData);
    setSavingFields(false);
    setEditing(false);
    router.refresh();
  }

  async function handleAddMilestone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingMilestone(true);
    const formData = new FormData(e.currentTarget);
    await addMilestone(project.id, formData);
    setSavingMilestone(false);
    setAddingMilestone(false);
    router.refresh();
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">
            <Link href="/admin/projects">PROJECTS</Link> — {CATEGORY_LABEL[project.category] ?? project.category}
          </div>
          <h1>{project.name}</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing((v) => !v)}>
            <Pencil size={13} strokeWidth={1.2} />
            EDIT
          </button>
          <form
            action={publishToPortfolio.bind(null, project.id, project.name, project.category, project.location)}
          >
            <button type="submit" className="btn btn-primary btn-sm">
              PUBLISH TO PORTFOLIO
            </button>
          </form>
        </div>
      </header>

      <div className="content">
        {/* Status bar */}
        <div className="panel panel-pad mb-40">
          {editing ? (
            <form onSubmit={handleSaveFields} className="flex items-center gap-24" style={{ flexWrap: "wrap" }}>
              <div className="field" style={{ marginBottom: 0, minWidth: 140 }}>
                <label>STAGE</label>
                <select name="stage" defaultValue={project.stage}>
                  {STAGE_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STAGE_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
                <label>CLIENT</label>
                <input name="client_name" defaultValue={project.client_name} />
              </div>
              <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
                <label>LOCATION</label>
                <input name="location" defaultValue={project.location ?? ""} />
              </div>
              <div className="field" style={{ marginBottom: 0, minWidth: 140 }}>
                <label>VALUE (QAR)</label>
                <input name="budget_value" type="number" defaultValue={project.budget_value ?? ""} />
              </div>
              <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
                <label>TARGET COMPLETION</label>
                {/* Free text, not a date — matches the convert form and values like "Q3 2027" / "TBD" / "Live". */}
                <input
                  name="target_completion"
                  type="text"
                  placeholder="e.g. Q3 2027"
                  defaultValue={project.target_completion ?? ""}
                />
              </div>
              <div className="flex gap-12" style={{ paddingBottom: 2 }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingFields}>
                  {savingFields ? "SAVING…" : "SAVE"}
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>
                  CANCEL
                </button>
              </div>
            </form>
          ) : (
            <div className="between" style={{ flexWrap: "wrap", gap: 20 }}>
              <div className="flex items-center gap-24" style={{ flexWrap: "wrap" }}>
                <div>
                  <div className="label mb-16">STAGE</div>
                  <span className="pill pill-olive">
                    <span className="dot" />
                    {STAGE_LABEL[project.stage]}
                  </span>
                </div>
                <div style={{ width: 1, height: 34, background: "var(--w06)" }} />
                <div>
                  <div className="label mb-16">CLIENT</div>
                  <span style={{ fontSize: 12 }}>{project.client_name}</span>
                </div>
                <div style={{ width: 1, height: 34, background: "var(--w06)" }} />
                <div>
                  <div className="label mb-16">LOCATION</div>
                  <span style={{ fontSize: 12 }}>{project.location ?? "—"}</span>
                </div>
                <div style={{ width: 1, height: 34, background: "var(--w06)" }} />
                <div>
                  <div className="label mb-16">VALUE</div>
                  <span className="tnum" style={{ fontSize: 12 }}>
                    QAR {formatCompactQAR(project.budget_value)}
                  </span>
                </div>
                <div style={{ width: 1, height: 34, background: "var(--w06)" }} />
                <div>
                  <div className="label mb-16">NEXT DUE</div>
                  <span style={{ fontSize: 12, color: nextDue ? "var(--amber)" : undefined }}>
                    {nextDue ? `${nextDue.title} · ${formatDateLabel(nextDue.event_date)}` : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stage progress */}
          <div className="flex items-center mt-40" style={{ gap: 4 }}>
            {STAGE_ORDER.map((s, i) => (
              <div
                key={s}
                style={{ flex: 1, height: 3, background: i <= currentStageIndex ? "var(--olive)" : "var(--w10)" }}
              />
            ))}
          </div>
          <div className="flex between mt-16">
            {STAGE_ORDER.map((s, i) => (
              <span key={s} className="label" style={{ color: i <= currentStageIndex ? "var(--olive)" : undefined }}>
                {STAGE_LABEL[s]}
                {i < currentStageIndex ? " ✓" : i === currentStageIndex ? " ●" : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="grid cols-main">
          {/* Left: timeline + photos */}
          <div className="stack gap-24">
          <div className="panel">
            <div className="panel-head">
              <h3>PROJECT TIMELINE</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAddingMilestone((v) => !v)}>
                <Plus size={12} strokeWidth={1.3} />
                ADD MILESTONE
              </button>
            </div>
            <div className="panel-pad" style={{ paddingTop: 26 }}>
              {addingMilestone && (
                <form onSubmit={handleAddMilestone} className="mb-24">
                  <div className="field">
                    <label>TITLE</label>
                    <input name="title" required placeholder="Milestone title" />
                  </div>
                  <div className="field">
                    <label>DESCRIPTION</label>
                    <textarea name="description" placeholder="Short description" rows={3} />
                  </div>
                  <div className="field-row">
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>DATE</label>
                      <input name="event_date" type="date" />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>STATUS</label>
                      <select name="status" defaultValue="planned">
                        <option value="done">DONE</option>
                        <option value="due">DUE</option>
                        <option value="planned">PLANNED</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-12 mt-24">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={savingMilestone}>
                      {savingMilestone ? "SAVING…" : "SAVE MILESTONE"}
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setAddingMilestone(false)}>
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              <div className="timeline">
                {milestones.length === 0 && <p className="dim tt-none">No milestones yet.</p>}
                {milestones.map((m) => {
                  const overdue = m.status === "due" && isOverdue(m.event_date);
                  const cls = m.status === "done" ? "done" : m.status === "due" ? "now" : "";
                  const statusLabel = overdue ? "OVERDUE" : m.status.toUpperCase();
                  return (
                    <div className={`tl-item${cls ? ` ${cls}` : ""}`} key={m.id}>
                      <div className="d">
                        {formatDateLong(m.event_date)} · {statusLabel}
                      </div>
                      <div className="h tt-none" style={overdue ? { color: "var(--amber)" } : undefined}>
                        {m.title}
                        {overdue ? " — OVERDUE" : ""}
                      </div>
                      {m.description && <div className="p">{m.description}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <ProjectMediaGallery projectId={project.id} media={media} />
          </div>

          {/* Right: details, team, client */}
          <div className="stack gap-24">
            <div className="panel panel-pad">
              <div className="label mb-24">DETAILS</div>
              <div className="dl">
                <dt>TYPE</dt>
                <dd className="tt-none">{project.project_type ?? "—"}</dd>
                <dt>AREA</dt>
                <dd className="tt-none">{project.area ?? "—"}</dd>
                <dt>STARTED</dt>
                <dd className="tt-none">{formatDateLong(project.created_at)}</dd>
                <dt>TARGET</dt>
                <dd className="tt-none">{project.target_completion || "—"}</dd>
                <dt>CONTRACT</dt>
                <dd className="tt-none">{project.contract_type ?? "—"}</dd>
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="label mb-24">TEAM</div>
              <div className="stack gap-16">
                {project.lead_principal && (
                  <div className="who">
                    <div className="avatar avatar-olive">{initialsOf(project.lead_principal)}</div>
                    <div className="n">
                      <b>{project.lead_principal}</b>
                      <span>LEAD PRINCIPAL</span>
                    </div>
                  </div>
                )}
                {project.designer && (
                  <div className="who">
                    <div className="avatar">{initialsOf(project.designer)}</div>
                    <div className="n">
                      <b>{project.designer}</b>
                      <span>DESIGNER</span>
                    </div>
                  </div>
                )}
                {!project.lead_principal && !project.designer && (
                  <p className="dim tt-none">No team assigned yet.</p>
                )}
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="between mb-24">
                <span className="label" style={{ margin: 0 }}>
                  CLIENT
                </span>
                {enquiry && (
                  <Link
                    href="/admin/enquiries"
                    className="label"
                    style={{ color: "var(--olive)", margin: 0 }}
                    title={`From enquiry: ${enquiry.name} (${enquiry.email})`}
                  >
                    ENQUIRY →
                  </Link>
                )}
              </div>
              <div className="who mb-16">
                <div className="avatar">{initialsOf(project.client_name)}</div>
                <div className="n">
                  <b>{project.client_name}</b>
                  <span className="tt-none">{project.client_email ?? "—"}</span>
                </div>
              </div>
              {project.client_phone && (
                <p className="dim tt-none" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                  {project.client_phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
