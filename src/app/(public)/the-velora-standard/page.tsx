import type { Metadata } from "next";
import { StandardHero } from "@/components/sections/standard/StandardHero";
import { BlueprintChapter } from "@/components/sections/standard/BlueprintChapter";
import { SpaceAssessment } from "@/components/sections/standard/SpaceAssessment";
import { VeloraEdit } from "@/components/sections/standard/VeloraEdit";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The Velora Standard",
  description:
    "The Velora Blueprint, a three-question space assessment, and The Velora Edit — intelligence for those who refuse to compromise.",
  path: "/the-velora-standard",
});

export default function StandardPage() {
  return (
    <>
      <StandardHero />
      <BlueprintChapter />
      <SpaceAssessment />
      <VeloraEdit />
    </>
  );
}
