import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-start justify-center bg-carbon px-5 sm:px-8 lg:px-12">
      <p className="text-[10px] uppercase tracking-[0.3em] text-olive">404</p>
      <h1 className="mt-6 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white">
        THIS SPACE
        <br />
        DOES NOT EXIST.
      </h1>
      <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/60">
        The page you are looking for was never drawn.
      </p>
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white hover:text-carbon"
      >
        RETURN TO VELORA
      </Link>
    </div>
  );
}
