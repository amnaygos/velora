"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import type { AppRole, TeamMember, TeamStatus } from "@/types/database";
import { inviteTeamMember, updateMemberRole, removeMember } from "./actions";

const APP_ROLES: { key: AppRole; label: string; hint: string }[] = [
  { key: "manager", label: "Manager", hint: "Full access" },
  { key: "sales", label: "Sales", hint: "Enquiries only" },
];

const PIPELINE_STAGES: { n: string; label: string; tag: string | null }[] = [
  { n: "01", label: "CONSULTATION", tag: "ENTRY" },
  { n: "02", label: "DESIGN", tag: null },
  { n: "03", label: "BUILD", tag: null },
  { n: "04", label: "OPERATIONS", tag: "FINAL" },
];

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusPillClass(status: TeamStatus) {
  return status === "pending" ? "pill pill-amber" : "pill pill-ghost";
}

export default function SettingsClient({
  teamMembers,
  currentEmail,
}: {
  teamMembers: TeamMember[];
  currentEmail: string | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appRole, setAppRole] = useState<AppRole>("sales");
  const [error, setError] = useState<string | null>(null);

  function closeDrawer() {
    setDrawerOpen(false);
    setAppRole("sales");
    setError(null);
    formRef.current?.reset();
  }

  async function handleInvite(formData: FormData) {
    setError(null);
    const result = await inviteTeamMember(formData);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    closeDrawer();
    router.refresh();
  }

  const changeRole = (memberId: string, role: AppRole) =>
    startTransition(async () => {
      await updateMemberRole(memberId, role);
      router.refresh();
    });

  const remove = (memberId: string) =>
    startTransition(async () => {
      await removeMember(memberId);
      router.refresh();
    });

  return (
    <>
      <div className="grid cols-main">
        {/* Left column */}
        <div className="stack gap-24">
          {/* Team */}
          <div className="panel">
            <div className="panel-head">
              <h3>TEAM &amp; ACCESS</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDrawerOpen(true)}>
                + ADD USER
              </button>
            </div>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Title</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="right"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="tt-none muted">
                        No team members yet.
                      </td>
                    </tr>
                  )}
                  {teamMembers.map((member) => {
                    const isSelf = member.email === currentEmail;
                    return (
                      <tr key={member.id}>
                        <td>
                          <div className="who">
                            <div className="avatar">{initialsFor(member.name)}</div>
                            <div className="n">
                              <b>
                                {member.name}
                                {isSelf ? " (you)" : ""}
                              </b>
                              <span className="tt-none">{member.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="muted">{member.role ? member.role.toUpperCase() : "—"}</td>
                        <td>
                          <select
                            className="role-select"
                            value={member.app_role}
                            disabled={isPending || isSelf}
                            title={isSelf ? "You can't change your own role" : "Change role"}
                            onChange={(e) => changeRole(member.id, e.target.value as AppRole)}
                          >
                            <option value="manager">MANAGER</option>
                            <option value="sales">SALES</option>
                          </select>
                        </td>
                        <td>
                          <span className={statusPillClass(member.status)}>
                            {member.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="right">
                          {!isSelf && (
                            <button
                              type="button"
                              className="icon-btn"
                              style={{ width: 30, height: 30 }}
                              title="Remove user"
                              disabled={isPending}
                              onClick={() => remove(member.id)}
                            >
                              <Trash2 size={13} strokeWidth={1.4} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pipeline stages */}
          <div className="panel">
            <div className="panel-head">
              <h3>PIPELINE STAGES</h3>
            </div>
            <div className="panel-pad">
              <p className="dim tt-none mb-24" style={{ fontSize: 11, letterSpacing: "0.05em" }}>
                Fixed pipeline — stages map to the project_stage enum.
              </p>
              <div className="stack gap-12">
                {PIPELINE_STAGES.map((s) => (
                  <div className="between" key={s.n} style={{ border: "1px solid var(--w06)", padding: "14px 18px" }}>
                    <div className="flex items-center gap-16">
                      <span className="dim tnum">{s.n}</span>
                      <span style={{ fontSize: 11, letterSpacing: "0.15em" }}>{s.label}</span>
                    </div>
                    {s.tag && (
                      <span
                        className="tag"
                        style={s.tag === "FINAL" ? { borderColor: "var(--w20)", color: "var(--w50)" } : undefined}
                      >
                        {s.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="stack gap-24">
          {/* Roles reference */}
          <div className="panel panel-pad">
            <div className="label mb-24">ACCESS ROLES</div>
            <div className="stack gap-16">
              <div>
                <b style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--olive)" }}>MANAGER</b>
                <p className="dim tt-none mt-8" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  Full workspace — overview, enquiries, projects, calendar, portfolio, the
                  website&apos;s content, and user management.
                </p>
              </div>
              <div className="divider-h" style={{ margin: "4px 0" }} />
              <div>
                <b style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--olive)" }}>SALES</b>
                <p className="dim tt-none mt-8" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  Enquiries only. Can work, assign, and progress leads — but cannot see projects,
                  the calendar, the portfolio, the website, or settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-user drawer */}
      <div className={`overlay${drawerOpen ? " open" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow mb-16">TEAM</div>
            <h2 style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>Add a User</h2>
          </div>
          <button type="button" className="icon-btn" onClick={closeDrawer}>
            <X size={15} strokeWidth={1.3} />
          </button>
        </div>
        <form ref={formRef} action={handleInvite} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="drawer-body">
            {error && <div className="login-error">{error}</div>}
            <div className="field">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Their name" />
            </div>
            <div className="field">
              <label>
                Email <span className="req">*</span>
              </label>
              <input type="email" name="email" className="tt-none" placeholder="name@velora.qa" required />
            </div>
            <div className="field">
              <label>Job Title</label>
              <input type="text" name="role" placeholder="e.g. Sales Agent" />
            </div>
            <div className="field">
              <label>
                Temporary Password <span className="req">*</span>
              </label>
              <input
                type="text"
                name="password"
                className="tt-none"
                placeholder="Min 8 characters — share with the user"
                minLength={8}
                required
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="label mb-16">ROLE</div>
              <input type="hidden" name="app_role" value={appRole} />
              <div className="choice-grid">
                {APP_ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.key}
                    className={`choice${appRole === r.key ? " sel" : ""}`}
                    onClick={() => setAppRole(r.key)}
                    style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}
                  >
                    <span className="flex items-center gap-12">
                      <span className="box" />
                      {r.label}
                    </span>
                    <span className="dim" style={{ fontSize: 8, letterSpacing: "0.15em", paddingLeft: 24 }}>
                      {r.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="drawer-foot">
            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: "center" }}
              disabled={isPending}
            >
              CREATE USER
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
