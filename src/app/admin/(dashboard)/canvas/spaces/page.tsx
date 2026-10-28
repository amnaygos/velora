import { loadCatalog } from "../data";
import SpacesBoard from "./SpacesBoard";

export const dynamic = "force-dynamic";

export default async function SpacesPage() {
  const { spaces, items, equipment } = await loadCatalog();
  const eq = new Map(equipment.map((e) => [e.id, e]));
  const counts: Record<string, number> = {};
  const thumbs: Record<string, { label: string; image: string | null }[]> = {};
  for (const i of items) {
    counts[i.space_id] = (counts[i.space_id] ?? 0) + 1;
    const e = eq.get(i.equipment_id);
    if (e) (thumbs[i.space_id] ??= []).push({ label: e.label, image: e.image });
  }
  return <SpacesBoard initial={spaces} counts={counts} thumbs={thumbs} />;
}
