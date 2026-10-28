"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Layers,
  CalendarDays,
  GalleryHorizontal,
  Globe,
  Boxes,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/admin/actions/auth";
import type { AppRole } from "@/types/database";

const NAV = [
  {
    group: "Workspace",
    items: [
      { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["manager"] },
      { id: "enquiries", label: "Enquiries", href: "/admin/enquiries", icon: Mail, roles: ["manager", "sales"] },
      { id: "projects", label: "Projects", href: "/admin/projects", icon: Layers, roles: ["manager"] },
      { id: "calendar", label: "Calendar", href: "/admin/calendar", icon: CalendarDays, roles: ["manager"] },
    ],
  },
  {
    group: "Content",
    items: [
      { id: "portfolio", label: "Portfolio", href: "/admin/portfolio", icon: GalleryHorizontal, roles: ["manager"] },
      { id: "website", label: "Website", href: "/admin/website", icon: Globe, roles: ["manager"] },
      { id: "canvas", label: "Space Canvas", href: "/admin/canvas", icon: Boxes, roles: ["manager"] },
    ],
  },
  {
    group: "System",
    items: [{ id: "settings", label: "Settings", href: "/admin/settings", icon: Settings, roles: ["manager"] }],
  },
] as const;

export default function Sidebar({
  name,
  role,
  initials,
  newEnquiryCount,
  appRole,
}: {
  name: string;
  role: string;
  initials: string;
  newEnquiryCount: number;
  appRole: AppRole;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Only show groups/items this role may reach — matches the middleware gate.
  const groups = NAV.map((g) => ({
    ...g,
    items: g.items.filter((item) => (item.roles as readonly AppRole[]).includes(appRole)),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="sidebar">
      <div className="side-logo">
        <img
          src="/images/logo full velora.svg"
          alt="VELORA"
          style={{ height: 18, width: "auto", filter: "brightness(0) invert(1)" }}
        />
        <span>ADMIN</span>
      </div>

      <nav className="side-scroll">
        {groups.map((g) => (
          <div key={g.group}>
            <div className="side-group-label">{g.group}</div>
            {g.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const badge = item.id === "enquiries" && newEnquiryCount > 0 ? newEnquiryCount : null;
              return (
                <Link key={item.id} href={item.href} className={`side-link${active ? " active" : ""}`}>
                  <Icon size={15} strokeWidth={1.2} />
                  <span>{item.label}</span>
                  {badge !== null && <span className="badge">{badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <div className="avatar avatar-olive">{initials}</div>
        <div className="meta">
          <b>{name}</b>
          <span>{role}</span>
        </div>
        <form action={signOut}>
          <button type="submit" className="signout" title="Sign out" style={{ background: "none", border: "none" }}>
            <LogOut size={13} strokeWidth={1.2} />
          </button>
        </form>
      </div>
    </aside>
  );
}
