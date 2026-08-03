import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the "middleware" convention to "proxy" (same request-time
// hook). Refreshes the Supabase session and enforces the RBAC route gate.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only /admin needs the session refreshed/gated — every other route
  // (home, portfolio, contact, etc.) is public and stays untouched.
  matcher: ["/admin/:path*"],
};
