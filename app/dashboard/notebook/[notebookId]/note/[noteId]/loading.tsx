import { PageWrapper } from "@/components/page-wrapper";
import { EditorSkeleton } from "@/components/skeletons/editor-skeleton";

export default function NoteEditorLoading() {
  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notebook", href: "/dashboard" },
        { label: "Note", href: "/dashboard" },
      ]}
    >
      <EditorSkeleton />
    </PageWrapper>
  );
}
