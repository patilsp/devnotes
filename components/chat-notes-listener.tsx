"use client";

import * as React from "react";
import { ChatNotesModal } from "@/components/chat-notes-modal";

export function ChatNotesListener() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K or Cmd+Shift+K opens Chat with Notes
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "K" || e.key === "k")) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("open-chat-notes", handleOpen);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-chat-notes", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <ChatNotesModal open={open} onOpenChange={setOpen} />;
}
