import { notFound } from "next/navigation";
import { loadCatalog } from "../../data";
import SpaceEditor from "../SpaceEditor";

export const dynamic = "force-dynamic";

export default async function SpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { spaces, items, equipment, materials } = await loadCatalog();
  const space = spaces.find((s) => s.id === id);
  if (!space) notFound();
  return (
    <SpaceEditor
      key={space.id}
      space={space}
      items={items.filter((i) => i.space_id === id)}
      equipment={equipment}
      materials={materials}
      groups={Array.from(new Set(spaces.map((s) => s.group_name)))}
      defaults={{ location: space.location, group: space.group_name }}
    />
  );
}
