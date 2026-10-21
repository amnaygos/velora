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
import { getProjects, getTestimonials } from "@/lib/website";

export default async function HomePage() {
  const [projects, testimonials] = await Promise.all([getProjects(), getTestimonials()]);
  return (
    <>
      <Preloader />
      <HomeHero />
      <ManifestoSection />
      <CredentialsSection />
      <SelectedWork projects={projects.filter((project) => project.featured)} />
      <TransformationSection projects={projects} />
      <ProcessFilm />
      <PhilosophySection />
      {testimonials[0] ? <TestimonialSection testimonial={testimonials[0]} /> : null}
      <BlueprintSection />
      <ClosingCTA />
    </>
  );
}
