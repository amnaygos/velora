import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem } from "@/types/database";
import PortfolioEditor from "../PortfolioEditor";
import { serviceOptions } from "../serviceOptions";

export const dynamic = "force-dynamic";

export default async function PortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, services] = await Promise.all([
    supabase.from("portfolio_items").select("*").eq("id", id).maybeSingle<PortfolioItem>(),
    serviceOptions(supabase),
  ]);
  if (!item) notFound();

  return <PortfolioEditor key={item.id} item={item} serviceOptions={services} />;
}
