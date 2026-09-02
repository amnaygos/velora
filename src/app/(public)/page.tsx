import { Preloader } from "@/components/sections/home/Preloader";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { ManifestoSection } from "@/components/sections/home/ManifestoSection";
import { CredentialsSection } from "@/components/sections/home/CredentialsSection";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { TransformationSection } from "@/components/sections/home/TransformationSection";
import { ProcessFilm } from "@/components/sections/home/ProcessFilm";
import { PhilosophySection } from "@/components/sections/home/PhilosophySection";
import { TestimonialSection } from "@/components/sections/home/TestimonialSection";
import { BlueprintSection } from "@/components/sections/home/BlueprintSection";
import { ClosingCTA } from "@/components/sections/home/ClosingCTA";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <HomeHero />
      <ManifestoSection />
      <CredentialsSection />
      <SelectedWork />
      <TransformationSection />
      <ProcessFilm />
      <PhilosophySection />
      <TestimonialSection />
      <BlueprintSection />
      <ClosingCTA />
    </>
  );
}
