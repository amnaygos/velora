import { loadCatalog } from "../data";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { settings, materials, features } = await loadCatalog();
  if (!settings) {
    return <div className="panel panel-pad"><p className="tt-none">The canvas_settings row is missing. Apply the latest Supabase migration.</p></div>;
  }
  return <PricingClient settings={settings} materials={materials} features={features} />;
}
