import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem, Project } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .returns<PortfolioItem[]>();

  const item = rows?.[0];
  if (!item) notFound();

  // If this portfolio piece was published from a project, surface the link.
  let project: Pick<Project, "id" | "name"> | null = null;
  if (item.project_id) {
    const { data: pr } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", item.project_id)
      .returns<Pick<Project, "id" | "name">[]>();
    project = pr?.[0] ?? null;
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">
            <Link href="/admin/portfolio" style={{ color: "var(--olive)" }}>
              PORTFOLIO
            </Link>{" "}
            — {item.category?.toUpperCase()}
          </div>
          <h1>{item.name}</h1>
        </div>
        <div className="topbar-actions">
          <Link href="/admin/portfolio" className="btn btn-outline btn-sm">
            <ArrowLeft size={13} strokeWidth={1.4} /> BACK
          </Link>
          <Link href={`/admin/portfolio?edit=${item.id}`} className="btn btn-primary btn-sm">
            <Pencil size={13} strokeWidth={1.4} /> EDIT
          </Link>
        </div>
      </header>

      <div className="content">
        <div className="between mb-24">
          <span
            className={`pill ${item.status === "published" ? "pill-solid" : "pill-amber"}`}
          >
            {item.status === "published" ? "PUBLISHED" : "DRAFT"}
          </span>
          <span className="dim" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
            {[item.location, item.year].filter(Boolean).join(" · ").toUpperCase()}
          </span>
        </div>

        {/* Before / After */}
        <div className="grid grid-2 mb-40">
          <div className="panel">
            <div className="panel-head">
              <h3>BEFORE</h3>
            </div>
            <div className="pf-thumb" style={{ aspectRatio: "4 / 3" }}>
              {item.before_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.before_image_url} alt="Before" />
              ) : (
                <div className="media-empty" style={{ height: "100%" }}>
                  <span>No before image</span>
                </div>
              )}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head">
              <h3>AFTER</h3>
            </div>
            <div className="pf-thumb" style={{ aspectRatio: "4 / 3" }}>
              {item.after_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.after_image_url} alt="After" />
              ) : (
                <div className="media-empty" style={{ height: "100%" }}>
                  <span>No after image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel panel-pad" style={{ maxWidth: 520 }}>
          <div className="label mb-24">DETAILS</div>
          <dl className="dl">
            <dt>NAME</dt>
            <dd className="tt-none">{item.name}</dd>
            <dt>CATEGORY</dt>
            <dd className="tt-none">{item.category}</dd>
            <dt>LOCATION</dt>
            <dd className="tt-none">{item.location || "—"}</dd>
            <dt>YEAR</dt>
            <dd className="tt-none">{item.year || "—"}</dd>
            <dt>SLUG</dt>
            <dd className="tt-none dim">{item.slug}</dd>
            <dt>SOURCE</dt>
            <dd className="tt-none">
              {project ? (
                <Link href={`/admin/projects/${project.id}`} style={{ color: "var(--olive)" }}>
                  {project.name} →
                </Link>
              ) : (
                "Added manually"
              )}
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
}
