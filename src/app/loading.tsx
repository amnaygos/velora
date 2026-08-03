import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

export default function RootLoading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-carbon">
      <LoadingIndicator label="VELORA" />
    </div>
  );
}
