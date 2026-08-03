import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem } from "@/types/database";
import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<PortfolioItem[]>();

  return <PortfolioClient items={data ?? []} />;
}
