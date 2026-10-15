"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  Sparkles,
  Workflow,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
} from "lucide-react";

export interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  command: (editor: Editor) => void;
}

interface SlashCommandMenuProps {
  editor: Editor | null;
  onOpenAI: () => void;
}

export function SlashCommandMenu({ editor, onOpenAI }: SlashCommandMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);

  const items: SlashMenuItem[] = React.useMemo(
    () => [
      {
        title: "Ask AI Assistant",
        description: "Generate code, explain, or draft content",
        badge: "AI",
        icon: Sparkles,
        command: (ed) => {
          // Remove the slash query text
          deleteSlashQuery(ed);
          onOpenAI();
        },
      },
      {
        title: "Mermaid Architecture Diagram",
        description: "Insert an interactive flowchart or sequence diagram",
        badge: "Mermaid",
        icon: Workflow,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain()
            .focus()
            .insertContent({
              type: "codeBlock",
              attrs: { language: "mermaid" },
              content: [
                {
                  type: "text",
                  text: `graph TD\n  Client[Web / Mobile Client] -->|HTTPS / API| Gateway[API Gateway]\n  Gateway --> Auth[Better Auth Service]\n  Gateway --> DB[(Neon Postgres)]\n  Gateway --> Cache[(Redis Cache)]`,
                },
              ],
            })
            .run();
        },
      },
      {
        title: "Code Block",
        description: "Formatted code block with syntax highlighting",
        badge: "Code",
        icon: Code2,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleCodeBlock().run();
        },
      },
      {
        title: "Heading 1",
        description: "Large section heading",
        icon: Heading1,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleHeading({ level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        description: "Medium section heading",
        icon: Heading2,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleHeading({ level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small subsection heading",
        icon: Heading3,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleHeading({ level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Simple bulleted list",
        icon: List,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Numbered sequential list",
        icon: ListOrdered,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleOrderedList().run();
        },
      },
      {
        title: "Quote Block",
        description: "Callout or quote citation",
        icon: Quote,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().toggleBlockquote().run();
        },
      },
      {
        title: "Divider",
        description: "Horizontal visual rule",
        icon: Minus,
        command: (ed) => {
          deleteSlashQuery(ed);
          ed.chain().focus().setHorizontalRule().run();
        },
      },
    ],
    [onOpenAI]
  );

  const filteredItems = React.useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.badge?.toLowerCase().includes(lower)
    );
  }, [items, query]);

  function deleteSlashQuery(ed: Editor) {
    const { state } = ed;
    const { $from } = state.selection;
    const currentLineText = $from.parent.textContent;
    const slashIdx = currentLineText.lastIndexOf("/");
    if (slashIdx !== -1) {
      const from = $from.start() + slashIdx;
      const to = $from.pos;
      ed.chain().focus().deleteRange({ from, to }).run();
    }
  }

  // Detect when user types `/`
  React.useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { state } = editor;
      const { $from } = state.selection;
      const lineText = $from.parent.textContent;
      const posInParent = $from.parentOffset;
      const textBeforeCursor = lineText.slice(0, posInParent);

      // Check if text ends with /something or just /
      const slashMatch = textBeforeCursor.match(/\/([a-zA-Z0-9_-]*)$/);

      if (slashMatch) {
        setQuery(slashMatch[1]);
        setIsOpen(true);
        setSelectedIndex(0);
      } else {
        setIsOpen(false);
        setQuery("");
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  // Handle keyboard navigation for the menu
  React.useEffect(() => {
    if (!isOpen || !editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].command(editor);
          setIsOpen(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, editor, filteredItems, selectedIndex]);

  if (!isOpen || filteredItems.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-6 left-6 z-50 w-72 max-h-80 overflow-y-auto rounded-lg border bg-popover text-popover-foreground shadow-xl p-1 animate-in fade-in-50 zoom-in-95"
    >
      <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b mb-1 flex items-center justify-between">
        <span>Insert Block or Action</span>
        <kbd className="text-[10px] bg-muted px-1 rounded border">ESC to close</kbd>
      </div>

      <div className="space-y-0.5">
        {filteredItems.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={item.title}
              type="button"
              onMouseEnter={() => setSelectedIndex(idx)}
              onClick={() => {
                if (editor) {
                  item.command(editor);
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                isSelected
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <div
                className={`p-1 rounded ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-foreground font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1 rounded bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
