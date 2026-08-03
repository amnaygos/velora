import { cn } from "@/lib/utils";

export function LoadingIndicator({
  label = "LOADING",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-px w-24 overflow-hidden bg-white/15">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-[velora-load_1.4s_ease-in-out_infinite] bg-olive" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
        {label}
      </p>
      <style>{`@keyframes velora-load { 0% { transform: translateX(-110%); } 100% { transform: translateX(320%); } }`}</style>
    </div>
  );
}
