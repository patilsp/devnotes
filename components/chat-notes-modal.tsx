"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  BookOpen,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Citation {
  id: string;
  notebookId: string;
  notebookName: string;
  title: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  citations?: Citation[];
  timestamp: Date;
}

interface ChatNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatNotesModal({ open, onOpenChange }: ChatNotesModalProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "👋 Hi! I'm your DevNotes Copilot. Ask me anything across all your notebooks and notes—from API keys to architecture decisions or code snippets.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          messages: messages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to search notes");
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: data.answer || "No response generated.",
        citations: data.citations || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: `⚠️ Error querying your notes: ${
          err instanceof Error ? err.message : "Something went wrong"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (sampleQuery: string) => {
    setInput(sampleQuery);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[85vh] max-h-[700px] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                Chat with Your Notes
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  RAG & Knowledge Search
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Ask questions across all notebooks with instant semantic retrieval and citations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Message feed */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 text-sm"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "assistant" && (
                <div className="size-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={`rounded-xl px-4 py-2.5 max-w-[85%] space-y-2 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/70 text-foreground border shadow-2xs"
                }`}
              >
                <div className="text-xs whitespace-pre-wrap leading-relaxed">
                  {renderFormattedText(msg.text, () => onOpenChange(false))}
                </div>

                {/* Citations section */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-border/50 text-[11px] space-y-1">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wide block">
                      Sources & Cited Notes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c) => (
                        <Link
                          key={c.id}
                          href={`/dashboard/notebook/${c.notebookId}/note/${c.id}`}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 hover:bg-background border text-foreground transition-colors group"
                        >
                          <FileText className="size-3 text-primary" />
                          <span className="font-medium truncate max-w-[140px]">
                            {c.title}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            ({c.notebookName})
                          </span>
                          <ExternalLink className="size-2.5 opacity-60 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="size-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-muted-foreground text-xs">
              <div className="size-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Loader2 className="size-4 animate-spin" />
              </div>
              <span className="animate-pulse">Searching through notebooks and synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Suggestion Quick Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-muted/20 border-t flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-muted-foreground shrink-0 font-medium">Try asking:</span>
            <button
              type="button"
              onClick={() => handleChipClick("What are the main architecture components in my notes?")}
              className="px-2 py-1 rounded border bg-background hover:bg-accent text-foreground truncate shrink-0"
            >
              "What are the main architecture components?"
            </button>
            <button
              type="button"
              onClick={() => handleChipClick("Summarize all my getting started notes")}
              className="px-2 py-1 rounded border bg-background hover:bg-accent text-foreground truncate shrink-0"
            >
              "Summarize all getting started notes"
            </button>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSend} className="p-3 border-t bg-card flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about any note or notebook..."
            className="flex-1 text-sm bg-background"
            disabled={isLoading}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="sm"
            className="gap-1.5 px-3"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span>Ask</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper to replace `[[Note: Title | id: X | nb: Y]]` markers with clickable links
function renderFormattedText(text: string, onClose: () => void): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[Note:\s*([^|]+)\s*\|\s*id:\s*([^|]+)\s*\|\s*nb:\s*([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const noteTitle = match[1].trim();
    const noteId = match[2].trim();
    const notebookId = match[3].trim();

    parts.push(
      <Link
        key={`${noteId}-${match.index}`}
        href={`/dashboard/notebook/${notebookId}/note/${noteId}`}
        onClick={onClose}
        className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-primary/15 text-primary hover:bg-primary/25 font-medium underline underline-offset-2 transition-colors"
      >
        <BookOpen className="size-3 inline" />
        {noteTitle}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
