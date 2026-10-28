"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/canvas/spaces", label: "Spaces", hint: "What each space is, contains and costs" },
  { href: "/admin/canvas/equipment", label: "Equipment", hint: "Machines and furniture" },
  { href: "/admin/canvas/materials", label: "Materials", hint: "Floors, walls, ceilings" },
  { href: "/admin/canvas/pricing", label: "Pricing", hint: "Feel tiers, glass, light, features, systems" },
];

export default function CanvasTabs() {
  const pathname = usePathname();
  return (
    <nav className="subnav" aria-label="Space Canvas">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} title={t.hint}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
