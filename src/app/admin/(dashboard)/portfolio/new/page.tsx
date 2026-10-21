import { createClient } from "@/lib/supabase/server";
import PortfolioEditor from "../PortfolioEditor";
import { serviceOptions } from "../serviceOptions";

export const dynamic = "force-dynamic";

export default async function NewPortfolioItemPage() {
  const supabase = await createClient();
  return <PortfolioEditor item={null} serviceOptions={await serviceOptions(supabase)} />;
}
