import { Skeleton } from "@/components/ui/skeleton";

export function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-50 duration-200">
      {/* Note Title Skeleton */}
      <div className="flex flex-col gap-2 pb-2 border-b">
        <Skeleton className="h-8 sm:h-9 w-64 rounded-lg" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </div>

      {/* Editor Container Skeleton */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        {/* Toolbar Skeleton */}
        <div className="flex items-center gap-1.5 p-2.5 border-b bg-muted/40">
          <Skeleton className="h-7 w-20 rounded" />
          <div className="h-4 w-px bg-border mx-1" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <div className="h-4 w-px bg-border mx-1" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <div className="h-4 w-px bg-border mx-1" />
          <Skeleton className="h-7 w-28 rounded" />
        </div>

        {/* Editor Body Skeleton */}
        <div className="p-6 sm:p-8 space-y-4 min-h-96">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />

          {/* Faux Code Block */}
          <div className="p-4 rounded-lg bg-muted/60 space-y-2 mt-4">
            <Skeleton className="h-3.5 w-1/4 rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
            <Skeleton className="h-3.5 w-1/2 rounded" />
          </div>

          <Skeleton className="h-4 w-full rounded mt-4" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
      </div>
    </div>
  );
}
