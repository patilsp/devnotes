import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function SidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader className="p-3 space-y-3">
        {/* Brand logo skeleton */}
        <div className="flex items-center gap-2 pl-1 py-1">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>

        {/* Search input skeleton */}
        <Skeleton className="h-9 w-full rounded-md" />
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-4">
        {[1, 2, 3].map((nb) => (
          <div key={nb} className="space-y-2 px-2">
            <div className="flex items-center justify-between py-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="size-3.5 rounded" />
            </div>
            <div className="pl-4 space-y-1.5 border-l border-border/40">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          </div>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
