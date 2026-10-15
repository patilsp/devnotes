import { CreateNotebookButton } from "@/components/create-notebook-button";
import NotebookCard from "@/components/notebook-card";
import { PageWrapper } from "@/components/page-wrapper";
import { EmptyState } from "@/components/empty-state";
import { getNotebooks } from "@/server/notebooks";
import { Card } from "@/components/ui/card";
import { BookOpen, FileText, Sparkles } from "lucide-react";

export default async function Page() {
  const notebooks = await getNotebooks();

  const notebookList = notebooks.success && notebooks.notebooks ? notebooks.notebooks : [];
  const totalNotebooks = notebookList.length;
  const totalNotes = notebookList.reduce(
    (acc, nb) => acc + (nb.notes?.length ?? 0),
    0
  );

  return (
    <PageWrapper breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}>
      {/* Dashboard Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Notebooks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Organize decisions, code snippets, and architecture docs into dedicated notebooks.
          </p>
        </div>

        <CreateNotebookButton />
      </div>

      {/* Summary / Statistic Cards */}
      {totalNotebooks > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-4 flex items-center justify-between border shadow-2xs bg-card/60">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Notebooks</p>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                {totalNotebooks}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border shadow-2xs bg-card/60">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Captured Notes</p>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                {totalNotes}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-chart-1/10 text-primary">
              <FileText className="size-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border shadow-2xs bg-card/60">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Command Palette</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">Ctrl + K</kbd> to jump anywhere
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Sparkles className="size-5" />
            </div>
          </Card>
        </div>
      )}

      {/* Notebooks Grid or Empty State */}
      {totalNotebooks > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase text-xs">
              All Notebooks ({totalNotebooks})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notebookList.map((notebook) => (
              <NotebookCard key={notebook.id} notebook={notebook} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No notebooks created yet"
          description="Create your first notebook to organize code snippets, architecture decisions, and meeting notes."
          action={<CreateNotebookButton />}
          className="my-6"
        />
      )}
    </PageWrapper>
  );
}
