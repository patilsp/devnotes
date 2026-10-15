"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notebook } from "@/db/schema";
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
import { ArrowUpRight, BookOpen, FileText, Loader2, Trash2 } from "lucide-react";
import { deleteNotebook } from "@/server/notebooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NotebookCardProps {
  notebook: Notebook;
}

export default function NotebookCard({ notebook }: NotebookCardProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteNotebook(notebook.id);

      if (response.success) {
        toast.success("Notebook deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete notebook");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const noteCount = notebook.notes?.length ?? 0;

  return (
    <Card className="group relative flex flex-col justify-between rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <BookOpen className="size-4" />
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <FileText className="size-3" />
            <span>{noteCount} {noteCount === 1 ? "note" : "notes"}</span>
          </span>
        </div>

        <div>
          <CardTitle className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            <Link
              href={`/dashboard/notebook/${notebook.id}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {notebook.name}
            </Link>
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {noteCount > 0
              ? `Latest: ${notebook.notes[0]?.title ?? "Untitled Note"}`
              : "No notes yet in this notebook"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="py-0" />

      <CardFooter className="flex items-center justify-between gap-2 pt-3 border-t">
        <Link href={`/dashboard/notebook/${notebook.id}`} className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground group-hover:text-primary"
          >
            <span>Open notebook</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </Link>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              aria-label={`Delete ${notebook.name}`}
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
              <AlertDialogTitle>Delete notebook?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &ldquo;{notebook.name}&rdquo; and all
                associated notes. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Notebook
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
