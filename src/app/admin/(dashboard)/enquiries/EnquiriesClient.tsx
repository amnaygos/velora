"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, UserPlus } from "lucide-react";
import type { AppRole, Enquiry, EnquiryStatus } from "@/types/database";
import { formatDateLabel } from "@/lib/admin/format";
import {
  updateEnquiryNote,
  updateEnquiryStatus,
  archiveEnquiry,
  assignEnquiry,
  claimEnquiry,
} from "./actions";

export interface TeamOption {
  id: string;
  name: string;
  app_role: AppRole;
  email: string;
}

type StatusFilter = "all" | EnquiryStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "new", label: "NEW" },
  { key: "contacted", label: "CONTACTED" },
  { key: "qualified", label: "QUALIFIED" },
  { key: "converted", label: "CONVERTED" },
  { key: "archived", label: "ARCHIVED" },
];

const STATUS_META: Record<EnquiryStatus, { label: string; pillClass: string; dim?: boolean }> = {
  new: { label: "NEW", pillClass: "pill-solid" },
  contacted: { label: "CONTACTED", pillClass: "pill-olive" },
  qualified: { label: "QUALIFIED", pillClass: "pill-olive" },
  converted: { label: "CONVERTED", pillClass: "pill-ghost" },
  archived: { label: "ARCHIVED", pillClass: "pill-ghost", dim: true },
};

// The manual pipeline (converted is reached only via the convert flow).
const PIPELINE: EnquiryStatus[] = ["new", "contacted", "qualified"];

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function receivedLabel(createdAt: string): string {
  const created = new Date(createdAt);
  const diffHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) return "JUST NOW";
  if (diffHours < 24) return `${Math.floor(diffHours)}H AGO`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "YESTERDAY";
  if (diffDays < 7) return `${diffDays} DAYS`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 WEEK";
  if (diffWeeks < 5) return `${diffWeeks} WEEKS`;
  return formatDateLabel(createdAt);
}

export default function EnquiriesClient({
  enquiries,
  team,
  appRole,
  currentMemberId,
}: {
  enquiries: Enquiry[];
  team: TeamOption[];
  appRole: AppRole;
  currentMemberId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<"all" | "mine" | "unassigned">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const isManager = appRole === "manager";
  const teamById = new Map(team.map((m) => [m.id, m]));
  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  const counts: Record<StatusFilter, number> = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    qualified: enquiries.filter((e) => e.status === "qualified").length,
    converted: enquiries.filter((e) => e.status === "converted").length,
    archived: enquiries.filter((e) => e.status === "archived").length,
  };

  const q = search.trim().toLowerCase();
  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "mine" && e.assigned_to === currentMemberId) ||
      (assigneeFilter === "unassigned" && !e.assigned_to);
    const matchesSearch =
      q === "" ||
      (e.name ?? "").toLowerCase().includes(q) ||
      (e.email ?? "").toLowerCase().includes(q) ||
      (e.company ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesAssignee && matchesSearch;
  });

  function openDrawer(enquiry: Enquiry) {
    setSelectedId(enquiry.id);
    setNoteDraft(enquiry.internal_note ?? "");
    setDrawerOpen(true);
  }

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  async function handleNoteBlur() {
    if (!selected) return;
    if (noteDraft === (selected.internal_note ?? "")) return;
    await updateEnquiryNote(selected.id, noteDraft);
    router.refresh();
  }

  function assigneeName(id: string | null): string {
    if (!id) return "";
    return teamById.get(id)?.name ?? "Assigned";
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — WORKSPACE</div>
          <h1>Enquiries</h1>
        </div>
        <div className="topbar-actions">
          <div className="search">
            <Search size={13} strokeWidth={1.4} />
            <input
              type="text"
              placeholder="Search enquiries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip${statusFilter === f.key ? " on" : ""}`}
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label} · {counts[f.key]}
              </button>
            ))}
          </div>
          <div className="filters">
            <button
              type="button"
              className={`chip${assigneeFilter === "all" ? " on" : ""}`}
              onClick={() => setAssigneeFilter("all")}
            >
              EVERYONE
            </button>
            <button
              type="button"
              className={`chip${assigneeFilter === "mine" ? " on" : ""}`}
              onClick={() => setAssigneeFilter("mine")}
            >
              ASSIGNED TO ME
            </button>
            <button
              type="button"
              className={`chip${assigneeFilter === "unassigned" ? " on" : ""}`}
              onClick={() => setAssigneeFilter("unassigned")}
            >
              UNASSIGNED
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Project Type</th>
                  <th>Budget</th>
                  <th>Assigned</th>
                  <th>Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="tt-none muted">
                      No enquiries match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((e) => {
                  const meta = STATUS_META[e.status];
                  const aName = assigneeName(e.assigned_to);
                  const partial = !e.name || !e.email || !e.project_type || !e.message;
                  return (
                    <tr
                      key={e.id}
                      className={e.status === "new" ? "row-flag" : ""}
                      onClick={() => openDrawer(e)}
                    >
                      <td>
                        <div className="who">
                          <div className="avatar">{initialsFor(e.name || "New lead")}</div>
                          <div className="n">
                            <b>{e.name || "New lead"}</b>
                            <span className="tt-none">{e.email || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="tt-none muted">{e.project_type || "—"}</td>
                      <td className="tt-none">{e.budget_range || "—"}</td>
                      <td>
                        {aName ? (
                          <span className="who" style={{ gap: 8 }}>
                            <span className="avatar" style={{ width: 24, height: 24, fontSize: 7 }}>
                              {initialsFor(aName)}
                            </span>
                            <span className="tt-none" style={{ fontSize: 10 }}>
                              {aName}
                            </span>
                          </span>
                        ) : (
                          <span className="dim" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
                            UNASSIGNED
                          </span>
                        )}
                      </td>
                      <td className="muted">{receivedLabel(e.created_at)}</td>
                      <td>
                        <span className="flex items-center gap-8">
                          <span
                            className={`pill ${meta.pillClass}`}
                            style={meta.dim ? { opacity: 0.6 } : undefined}
                          >
                            {meta.label}
                          </span>
                          {partial && e.source === "AI Assistant" && (
                            <span className="pill pill-amber" title="Captured live by the AI concierge — still gathering details">
                              PARTIAL
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="dim mt-24" style={{ fontSize: 8, letterSpacing: "0.2em" }}>
          SHOWING {filtered.length} OF {enquiries.length} · CLICK ANY ROW TO OPEN THE FULL ENQUIRY
        </p>
      </div>

      <div className={`overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`}>
        {selected && (
          <>
            <div className="drawer-head">
              <div>
                <div className="eyebrow mb-16">
                  {STATUS_META[selected.status].label} ENQUIRY · {receivedLabel(selected.created_at)}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>
                  {selected.name || "New lead"}
                </h2>
              </div>
              <button className="icon-btn" onClick={() => setDrawerOpen(false)}>
                <X size={13} strokeWidth={1.3} />
              </button>
            </div>
            <div className="drawer-body">
              <dl className="dl mb-40">
                <dt>EMAIL</dt>
                <dd className="tt-none" style={{ color: "var(--olive)" }}>
                  {selected.email || "—"}
                </dd>
                <dt>PHONE</dt>
                <dd className="tt-none">{selected.phone || "—"}</dd>
                <dt>COMPANY</dt>
                <dd className="tt-none">{selected.company || "—"}</dd>
                <dt>PROJECT</dt>
                <dd className="tt-none">{selected.project_type || "—"}</dd>
                <dt>BUDGET</dt>
                <dd className="tt-none">{selected.budget_range || "—"}</dd>
                <dt>SOURCE</dt>
                <dd>{selected.source || "—"}</dd>
              </dl>

              {/* Status pipeline */}
              <div className="section-head">
                <span className="eyebrow">STATUS</span>
              </div>
              <div className="filters mb-24" style={{ marginBottom: 24 }}>
                {PIPELINE.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip${selected.status === s ? " on" : ""}`}
                    disabled={isPending || selected.status === "converted"}
                    onClick={() => run(() => updateEnquiryStatus(selected.id, s))}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
                {selected.status === "converted" && (
                  <span className="pill pill-ghost">CONVERTED — LOCKED</span>
                )}
              </div>

              {/* Assignment */}
              <div className="section-head">
                <span className="eyebrow">ASSIGNED TO</span>
              </div>
              <div className="field" style={{ marginBottom: 32 }}>
                {isManager ? (
                  <select
                    value={selected.assigned_to ?? ""}
                    disabled={isPending}
                    onChange={(e) =>
                      run(() => assignEnquiry(selected.id, e.target.value || null))
                    }
                  >
                    <option value="">— Unassigned —</option>
                    {team.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.app_role})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-12">
                    <span className="tt-none" style={{ fontSize: 12 }}>
                      {selected.assigned_to ? assigneeName(selected.assigned_to) : "Unassigned"}
                    </span>
                    {selected.assigned_to !== currentMemberId && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={isPending}
                        onClick={() => run(() => claimEnquiry(selected.id))}
                      >
                        <UserPlus size={12} strokeWidth={1.4} /> CLAIM
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="section-head">
                <span className="eyebrow">THEIR VISION</span>
              </div>
              <p
                className="tt-none"
                style={{ fontSize: 12, lineHeight: 2, color: "var(--w70)", letterSpacing: "0.03em" }}
              >
                {selected.message || "— not yet provided —"}
              </p>

              <div className="divider-h" />

              <div className="section-head">
                <span className="eyebrow">INTERNAL NOTE</span>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <textarea
                  className="tt-none"
                  placeholder="Add a note for the team…"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  onBlur={handleNoteBlur}
                />
              </div>
            </div>
            <div className="drawer-foot">
              {isManager && selected.status !== "converted" && (
                <Link
                  href={`/admin/enquiries/${selected.id}/convert`}
                  className="btn btn-primary w-full"
                  style={{ justifyContent: "center" }}
                >
                  CONVERT TO PROJECT
                  <ArrowRight size={13} strokeWidth={1.3} />
                </Link>
              )}
              <button
                className="btn btn-outline"
                onClick={() => run(async () => {
                  await archiveEnquiry(selected.id);
                  setDrawerOpen(false);
                })}
                disabled={isPending || selected.status === "archived"}
              >
                ARCHIVE
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
