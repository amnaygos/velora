import type { createClient } from "@/lib/supabase/server";

/** Every service named on any case study, so the editor can offer them as one-tap choices. */
export async function serviceOptions(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string[]> {
  const { data } = await supabase.from("portfolio_items").select("services");
  return Array.from(new Set((data ?? []).flatMap((row: { services: string[] }) => row.services ?? []))).sort();
}
