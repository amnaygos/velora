import { loadCatalog } from "../../data";
import SpaceEditor from "../SpaceEditor";

export const dynamic = "force-dynamic";

export default async function NewSpacePage({ searchParams }: { searchParams: Promise<{ location?: string; group?: string }> }) {
  const { location, group } = await searchParams;
  const { spaces, equipment, materials } = await loadCatalog();
  return (
    <SpaceEditor
      space={null}
      items={[]}
      equipment={equipment}
      materials={materials}
      groups={Array.from(new Set(spaces.map((s) => s.group_name)))}
      defaults={{ location: location === "out" ? "out" : "in", group: group ?? "" }}
    />
  );
}
