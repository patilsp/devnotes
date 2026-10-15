"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Book,
  FileText,
  Plus,
  LayoutDashboard,
  Moon,
  Sun,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getNotebooks } from "@/server/notebooks";
import { authClient } from "@/lib/auth-client";

interface NotebookItem {
  id: string;
  name: string;
  notes: { id: string; title: string }[];
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [notebooks, setNotebooks] = React.useState<NotebookItem[]>([]);
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  // Load notebooks on mount and when opening
  const fetchItems = React.useCallback(async () => {
    try {
      const res = await getNotebooks();
      if (res.success && res.notebooks) {
        setNotebooks(res.notebooks as NotebookItem[]);
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => {
      fetchItems();
      setOpen(true);
    };

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [fetchItems]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search notes & notebooks..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Notes */}
        {notebooks.some((nb) => nb.notes.length > 0) && (
          <CommandGroup heading="Notes">
            {notebooks.flatMap((nb) =>
              nb.notes.map((note) => (
                <CommandItem
                  key={note.id}
                  value={`note ${note.title} ${nb.name}`}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(
                        `/dashboard/notebook/${nb.id}/note/${note.id}`
                      )
                    )
                  }
                >
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  <span>{note.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    in {nb.name}
                  </span>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}

        {/* Notebooks */}
        {notebooks.length > 0 && (
          <CommandGroup heading="Notebooks">
            {notebooks.map((nb) => (
              <CommandItem
                key={nb.id}
                value={`notebook ${nb.name}`}
                onSelect={() =>
                  runCommand(() => router.push(`/dashboard/notebook/${nb.id}`))
                }
              >
                <Book className="mr-2 h-4 w-4 text-primary" />
                <span>{nb.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({nb.notes.length} {nb.notes.length === 1 ? "note" : "notes"})
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            value="chat with your notes rag semantic search ai copilot"
            onSelect={() =>
              runCommand(() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-chat-notes"));
                }
              })
            }
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <div className="flex items-center gap-1.5 flex-1">
              <span>Chat with Your Notes (RAG Copilot)</span>
              <span className="text-[10px] font-mono px-1 rounded bg-primary/10 text-primary">NEW</span>
            </div>
            <CommandShortcut>Ctrl+Shift+K</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="ask ai assistant code generate explain"
            onSelect={() =>
              runCommand(() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      key: "j",
                      ctrlKey: true,
                      bubbles: true,
                    })
                  );
                }
              })
            }
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span>Ask DevNotes AI Assistant</span>
            <CommandShortcut>Ctrl+J</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="go to dashboard home"
            onSelect={() => runCommand(() => router.push("/dashboard"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="toggle theme dark light"
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="sign out log out"
            onSelect={() =>
              runCommand(async () => {
                await authClient.signOut();
                router.push("/login");
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Log Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
