"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="flex min-h-[100dvh] flex-col items-start justify-center bg-carbon px-5 sm:px-8 lg:px-12">
      <p className="text-[10px] uppercase tracking-[0.3em] text-olive">ERROR</p>
      <h1 className="mt-6 text-xl font-extralight uppercase leading-[1.12] tracking-[0.09em] text-white">
        SOMETHING LOST
        <br />
        ITS ALIGNMENT.
      </h1>
      <p className="mt-8 max-w-md text-base font-light leading-[1.7] text-white/60">
        An unexpected error interrupted the experience. It has been noted.
      </p>
      <button
        type="button"
        onClick={retry}
        className="group mt-12 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white hover:text-carbon"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
