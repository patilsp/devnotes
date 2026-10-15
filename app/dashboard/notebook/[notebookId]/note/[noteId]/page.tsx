import { PageWrapper } from "@/components/page-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { getNoteById } from "@/server/notes";
import { JSONContent } from "@tiptap/react";
import { notFound } from "next/navigation";

type Params = Promise<{
  noteId: string;
}>;

export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;

  const { success, note } = await getNoteById(noteId);

  if (success && !note) notFound();

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: note?.notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${note?.notebook?.id}`,
        },
        {
          label: note?.title ?? "Note",
          href: `/dashboard/notebook/${note?.notebook?.id}/note/${noteId}`,
        },
      ]}
    >
      {/* Note Header */}
      <div className="flex flex-col gap-1 pb-3 border-b">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="text-primary">{note?.notebook?.name}</span>
          <span>/</span>
          <span>Document</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {note?.title}
        </h1>
      </div>

      <RichTextEditor
        content={note?.content as JSONContent[]}
        noteId={noteId}
      />
    </PageWrapper>
  );
}
