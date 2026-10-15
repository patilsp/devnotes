"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

export function ChatNotesSidebarButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-chat-notes"));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-between text-xs text-primary font-medium hover:bg-primary/10 transition-colors px-2 py-1.5 rounded-md group"
      title="Chat with Your Notes (RAG Copilot)"
    >
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-primary/15 text-primary group-hover:scale-105 transition-transform">
          <Sparkles className="size-3.5" />
        </div>
        <span>Chat with Notes</span>
      </div>
      <kbd className="rounded border bg-background/80 px-1 py-0.5 text-[9px] font-mono text-muted-foreground">
        Ctrl+Shift+K
      </kbd>
    </button>
  );
}
