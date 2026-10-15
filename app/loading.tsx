import { BrandedSpinner } from "@/components/ui/branded-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <BrandedSpinner message="Preparing your workspace..." />
    </div>
  );
}
