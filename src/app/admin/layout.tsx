import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Velora Admin",
  description: "Velora studio workspace — enquiries, projects, calendar, and portfolio.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
