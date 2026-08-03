import { ButtonLink } from "@/components/ui/Button";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-start justify-center bg-carbon px-5 sm:px-8 lg:px-12">
      <p className="text-[10px] uppercase tracking-[0.3em] text-olive">404</p>
      <h1 className="mt-6 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white">
        THIS PROJECT
        <br />
        REMAINS PRIVATE.
      </h1>
      <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/60">
        The work you are looking for is not part of the public portfolio.
      </p>
      <div className="mt-12">
        <ButtonLink href="/portfolio" transitionLabel="VELORA — PORTFOLIO">
          VIEW THE PORTFOLIO
        </ButtonLink>
      </div>
    </div>
  );
}
