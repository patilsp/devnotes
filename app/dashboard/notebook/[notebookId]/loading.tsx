import { PageWrapper } from "@/components/page-wrapper";
import { NotebookSkeleton } from "@/components/skeletons/notebook-skeleton";

export default function NotebookLoading() {
  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notebook", href: "/dashboard" },
      ]}
    >
      <NotebookSkeleton />
    </PageWrapper>
  );
}
