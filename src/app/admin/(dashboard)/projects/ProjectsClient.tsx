"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Kanban, List as ListIcon, Plus } from "lucide-react";
import { formatCompactQAR, CATEGORY_LABEL, STAGE_LABEL } from "@/lib/admin/format";
import { mediaUrl } from "@/lib/admin/media";
import type { Project, ProjectCategory, ProjectStage } from "@/types/database";

const STAGES: ProjectStage[] = ["consultation", "design", "build", "operations"];

const STAGE_PILL_CLASS: Record<ProjectStage, string> = {
  consultation: "pill",
  design: "pill",
  build: "pill pill-olive",
  operations: "pill pill-ghost",
};

const CATEGORY_KEYS = Object.keys(CATEGORY_LABEL) as ProjectCategory[];

function initialsFor(name: string | null): string {
  if (!name) return "—";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectsClient({
  projects,
  coverByProject,
}: {
  projects: Project[];
  coverByProject: Record<string, string>;
}) {
  const router = useRouter();
  const [view, setView] = useState<"board" | "list">("board");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const filtered = category === "all" ? projects : projects.filter((p) => p.category === category);
  const pipelineValue = projects.reduce((sum, p) => sum + (p.budget_value ?? 0), 0);

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — WORKSPACE</div>
          <h1>Projects</h1>
        </div>
        <div className="topbar-actions">
          <div className="seg">
            <button className={view === "board" ? "active" : ""} onClick={() => setView("board")}>
              <Kanban size={12} strokeWidth={1.3} />
              BOARD
            </button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
              <ListIcon size={12} strokeWidth={1.3} />
              LIST
            </button>
          </div>
          <Link href="/admin/enquiries" className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={1.3} />
            NEW
          </Link>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <div className="filters">
            <button className={`chip${category === "all" ? " on" : ""}`} onClick={() => setCategory("all")}>
              ALL TYPES
            </button>
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                className={`chip${category === key ? " on" : ""}`}
                onClick={() => setCategory(key)}
              >
                {CATEGORY_LABEL[key]}
              </button>
            ))}
          </div>
          <p className="dim" style={{ fontSize: 8, letterSpacing: "0.2em" }}>
            {projects.length} ACTIVE · {formatCompactQAR(pipelineValue)} QAR PIPELINE
          </p>
        </div>

        {view === "board" ? (
          <div className="kanban">
            {STAGES.map((stage) => {
              const stageProjects = filtered.filter((p) => p.stage === stage);
              return (
                <div className="kan-col" key={stage}>
                  <div className="kan-col-head">
                    <span className="t">{STAGE_LABEL[stage]}</span>
                    <span className="c">{stageProjects.length}</span>
                  </div>
                  <div className="kan-list">
                    {stageProjects.map((p) => (
                      <Link key={p.id} href={`/admin/projects/${p.id}`} className="kan-card">
                        {coverByProject[p.id] && (
                          <div className="kan-cover">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mediaUrl(coverByProject[p.id])} alt="" loading="lazy" />
                          </div>
                        )}
                        <div className="cat">{CATEGORY_LABEL[p.category]}</div>
                        <div className="nm">{p.name}</div>
                        <div className="meta">
                          <span className="loc">{p.location?.toUpperCase() ?? "—"}</span>
                          <span className="val">QAR {formatCompactQAR(p.budget_value)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="panel">
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Stage</th>
                    <th className="right">Budget</th>
                    <th>Lead</th>
                    <th className="right">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="tt-none muted">
                        No projects match this filter.
                      </td>
                    </tr>
                  )}
                  {filtered.map((p) => (
                    <tr key={p.id} onClick={() => router.push(`/admin/projects/${p.id}`)}>
                      <td>
                        <div className="flex items-center gap-12">
                          {coverByProject[p.id] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="row-thumb"
                              src={mediaUrl(coverByProject[p.id])}
                              alt=""
                              loading="lazy"
                            />
                          )}
                          <div>
                            <Link
                              href={`/admin/projects/${p.id}`}
                              className="primary"
                              style={{ display: "block" }}
                            >
                              {p.name}
                            </Link>
                            <span className="dim" style={{ fontSize: 8, letterSpacing: "0.15em" }}>
                              {p.location?.toUpperCase() ?? ""}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="tt-none muted">{p.company || p.client_name}</td>
                      <td className="muted">{CATEGORY_LABEL[p.category]}</td>
                      <td>
                        <span className={STAGE_PILL_CLASS[p.stage]}>
                          <span className="dot" />
                          {STAGE_LABEL[p.stage]}
                        </span>
                      </td>
                      <td className="num tt-none">{formatCompactQAR(p.budget_value)}</td>
                      <td>
                        <div className="avatar" style={{ width: 24, height: 24, fontSize: 7 }}>
                          {initialsFor(p.lead_principal)}
                        </div>
                      </td>
                      <td className="right muted">{p.target_completion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
