import { TIERS, TIER_LABEL } from "@/types/canvas";
import { loadCatalog } from "../data";
import MaterialsClient from "./MaterialsClient";

export const dynamic = "force-dynamic";

const SLOT: Record<string, string> = { floor: "floor", walls: "walls", ceiling: "ceiling" };

export default async function MaterialsPage() {
  const { materials, spaces, settings } = await loadCatalog();
  // Where each finish is a default: Feel tiers and space floors.
  const usage: Record<string, string[]> = {};
  const add = (key: string, where: string) => (usage[key] ??= []).push(where);
  if (settings) {
    for (const t of TIERS) {
      const tier = settings.tiers[t];
      if (!tier) continue;
      for (const [room, slots] of [["dry", tier.dry], ["wet", tier.wet], ["outdoor", tier.out]] as const)
        for (const [slot, key] of Object.entries(slots)) add(key, `${TIER_LABEL[t]} ${room} ${SLOT[slot] ?? slot}`);
      add(tier.hall, `${TIER_LABEL[t]} walkways`);
    }
  }
  for (const s of spaces) if (s.default_floor) add(s.default_floor, `${s.label} floor`);
  return <MaterialsClient initial={materials} usage={usage} />;
}
