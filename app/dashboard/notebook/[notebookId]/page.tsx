import { CreateNoteButton } from "@/components/create-note-button";
import NoteCard from "@/components/note-card";
import { PageWrapper } from "@/components/page-wrapper";
import { EmptyState } from "@/components/empty-state";
import { getNotebookById } from "@/server/notebooks";
import { notFound } from "next/navigation";
import { FileCode } from "lucide-react";

type Params = Promise<{
  notebookId: string;
}>;

export default async function NotebookPage({ params }: { params: Params }) {
  const { notebookId } = await params;

  const { success, notebook } = await getNotebookById(notebookId);

  // A deleted (or bad) id should 404 instead of rendering an empty shell with a
  // "Create Note" button that can never succeed.
  if (success && !notebook) notFound();

  const notesList = notebook?.notes ?? [];
  const noteCount = notesList.length;

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${notebookId}`,
        },
      ]}
    >
      {/* Notebook Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {notebook?.name}
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {noteCount} {noteCount === 1 ? "note" : "notes"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage notes and snippets stored inside this notebook.
          </p>
        </div>

        <CreateNoteButton notebookId={notebookId} />
      </div>

      {/* Notes Grid or Empty State */}
      {noteCount > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Notes ({noteCount})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notesList.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileCode}
          title="No notes in this notebook yet"
          description="Create your first note in this notebook to capture code snippets, decisions, or architecture diagrams."
          action={<CreateNoteButton notebookId={notebookId} />}
          className="my-6"
        />
      )}
    </PageWrapper>
  );
}
