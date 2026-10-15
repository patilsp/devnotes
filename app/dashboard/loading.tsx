import { PageWrapper } from "@/components/page-wrapper";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <PageWrapper breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}>
      <DashboardSkeleton />
    </PageWrapper>
  );
}
