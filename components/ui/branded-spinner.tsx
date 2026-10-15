import { cn } from "@/lib/utils";
import { DevNotesLogo } from "@/components/logo";

interface BrandedSpinnerProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandedSpinner({
  message = "Preparing your workspace...",
  className,
  size = "md",
}: BrandedSpinnerProps) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center select-none",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle pulsing background glow */}
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full bg-primary/20 blur-md motion-safe:animate-pulse"
        />

        {/* Outer subtle rotating ring */}
        <div
          aria-hidden
          className="size-12 rounded-full border-2 border-primary/20 border-t-primary motion-safe:animate-spin"
        />

        {/* Centered DevNotes logo mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <DevNotesLogo className={cn(sizeClasses, "shrink-0 drop-shadow-xs")} />
        </div>
      </div>

      {message && (
        <p className="text-xs font-medium tracking-tight text-muted-foreground motion-safe:animate-pulse">
          {message}
        </p>
      )}
      <span className="sr-only">Loading DevNotes...</span>
    </div>
  );
}
