import { loadCatalog } from "../data";
import EquipmentClient from "./EquipmentClient";

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const { equipment, items, spaces } = await loadCatalog();
  const label = new Map(spaces.map((s) => [s.id, s.label]));
  const usage: Record<string, string[]> = {};
  for (const i of items) (usage[i.equipment_id] ??= []).push(label.get(i.space_id) ?? "?");
  return <EquipmentClient initial={equipment} usage={usage} />;
}
