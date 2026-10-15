"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpRight, Clock, FileCode, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteNote } from "@/server/notes";

interface NotebookCardProps {
  note: Note;
}

// Extract a clean text preview from TipTap JSONContent
function extractPreview(content: unknown): string {
  if (!content || typeof content !== "object") return "";

  const textPieces: string[] = [];
  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    const item = node as { type?: string; text?: string; content?: unknown[] };
    if (item.text) {
      textPieces.push(item.text);
    }
    if (Array.isArray(item.content)) {
      for (const child of item.content) {
        walk(child);
      }
    }
  }

  walk(content);
  return textPieces.join(" ").trim();
}

export default function NoteCard({ note }: NotebookCardProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteNote(note.id);

      if (response.success) {
        toast.success("Note deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const preview = extractPreview(note.content);
  const noteDate = note.updatedAt || note.createdAt;
  const formattedDate = noteDate
    ? new Date(noteDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card className="group relative flex flex-col justify-between rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <FileCode className="size-4" />
          </div>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/80">
              <Clock className="size-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        <div>
          <CardTitle className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            <Link
              href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {note.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {preview || "No content yet. Open note to start writing."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 pt-3 border-t">
        <Link
          href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
          className="flex-1"
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground group-hover:text-primary"
          >
            <span>Open note</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </Link>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              aria-label={`Delete ${note.title}`}
              className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              {isDeleting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete note?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &ldquo;{note.title}&rdquo;. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Note
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
