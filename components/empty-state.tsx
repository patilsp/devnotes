import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 sm:p-12 text-center transition-all",
        className
      )}
    >
      <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 text-primary mb-4 shadow-2xs">
        <Icon className="size-6 sm:size-7" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
