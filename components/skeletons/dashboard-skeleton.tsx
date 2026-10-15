import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-50 duration-200">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Summary Stats Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 flex items-center justify-between shadow-2xs">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-7 w-12 rounded" />
            </div>
            <Skeleton className="size-10 rounded-xl" />
          </Card>
        ))}
      </div>

      {/* Section Subheader Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      {/* Notebook Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col justify-between shadow-2xs">
            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4 rounded mt-2" />
            </CardHeader>
            <CardContent className="py-2">
              <Skeleton className="h-3.5 w-28 rounded" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-3 border-t">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
