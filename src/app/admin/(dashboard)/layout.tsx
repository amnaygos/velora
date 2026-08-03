import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import { roleFromUser } from "@/lib/admin/rbac";

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appRole = roleFromUser(user);

  // The badge count is only meaningful (and only visible in nav) for people
  // who can see enquiries — which is everyone — so always fetch it.
  const { count: newEnquiryCount } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  let member: { name: string; role: string | null } | null = null;
  if (user?.email) {
    const { data } = await supabase
      .from("team_members")
      .select("name, role")
      .eq("email", user.email)
      .returns<{ name: string; role: string | null }[]>();
    member = data?.[0] ?? null;
  }

  const name = member?.name ?? user?.email ?? "User";
  const roleLabel = member?.role ?? (appRole === "sales" ? "Sales Agent" : "Team Member");

  return (
    <div className="app">
      <Sidebar
        name={name}
        role={roleLabel.toUpperCase()}
        initials={initialsFor(name)}
        newEnquiryCount={newEnquiryCount ?? 0}
        appRole={appRole}
      />
      <div className="main">{children}</div>
    </div>
  );
}
