"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Loader2,
  Check,
  Copy,
  CornerDownLeft,
  FileCode,
  Wand2,
  Bug,
  TestTube,
  FileText,
  Workflow,
} from "lucide-react";
import { MermaidViewer } from "@/components/mermaid-viewer";

interface AIAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText?: string;
  fullNoteText?: string;
  onInsert: (content: string, replace?: boolean) => void;
}

export function AIAssistantModal({
  open,
  onOpenChange,
  selectedText = "",
  fullNoteText = "",
  onInsert,
}: AIAssistantModalProps) {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [viewRaw, setViewRaw] = React.useState(false);
  const [command, setCommand] = React.useState<
    "generate" | "explain" | "fix" | "test" | "summarize" | "diagram"
  >("generate");

  const activeContext = selectedText || fullNoteText;

  const handleGenerate = async (
    overrideCommand?: "generate" | "explain" | "fix" | "test" | "summarize" | "diagram",
    overridePrompt?: string
  ) => {
    const cmd = overrideCommand || command;
    const p = overridePrompt !== undefined ? overridePrompt : prompt;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: p,
          context: activeContext,
          command: cmd,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setResult(data.text);
      } else if (data.error) {
        setResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setResult(`Failed to connect to AI service: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInsert = (replace: boolean = false) => {
    if (result) {
      onInsert(result, replace);
      onOpenChange(false);
      setResult(null);
      setPrompt("");
    }
  };

  const isMermaid =
    result &&
    (result.includes("```mermaid") ||
      result.includes("flowchart") ||
      result.includes("sequenceDiagram") ||
      result.includes("classDiagram") ||
      result.includes("erDiagram"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                DevNotes AI Assistant
              </DialogTitle>
              <DialogDescription className="text-xs">
                Generate code, diagrams, explain concepts, review bugs, or summarize your
                notes with AI.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick action preset pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            type="button"
            variant={command === "generate" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => setCommand("generate")}
          >
            <Wand2 className="size-3.5" />
            Generate
          </Button>
          <Button
            type="button"
            variant={command === "diagram" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              setCommand("diagram");
              handleGenerate(
                "diagram",
                prompt || "Create an architecture flow diagram"
              );
            }}
          >
            <Workflow className="size-3.5" />
            Diagram Architecture
          </Button>
          <Button
            type="button"
            variant={command === "explain" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              setCommand("explain");
              handleGenerate("explain");
            }}
          >
            <FileCode className="size-3.5" />
            Explain
          </Button>
          <Button
            type="button"
            variant={command === "fix" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              setCommand("fix");
              handleGenerate("fix");
            }}
          >
            <Bug className="size-3.5" />
            Fix & Optimize
          </Button>
          <Button
            type="button"
            variant={command === "test" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              setCommand("test");
              handleGenerate("test");
            }}
          >
            <TestTube className="size-3.5" />
            Unit Tests
          </Button>
          <Button
            type="button"
            variant={command === "summarize" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              setCommand("summarize");
              handleGenerate("summarize");
            }}
          >
            <FileText className="size-3.5" />
            Summarize
          </Button>
        </div>

        {/* Selected context indicator */}
        {selectedText ? (
          <div className="text-xs text-muted-foreground bg-muted/60 p-2 rounded border truncate">
            <span className="font-semibold text-foreground">
              Selected Context:
            </span>{" "}
            &quot;{selectedText.slice(0, 120)}...&quot;
          </div>
        ) : null}

        {/* Prompt Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder={
              command === "diagram"
                ? "Describe system architecture or flow (e.g., 'OAuth 2.0 PKCE flow', 'Next.js App Router data flow')..."
                : command === "explain"
                ? "Ask a specific question about the snippet..."
                : command === "fix"
                ? "Any specific requirements or edge cases to consider?"
                : "Type instructions (e.g., 'Create an async rate-limiter in TypeScript')..."
            }
            className="flex-1 px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading || (!prompt && !activeContext)}
            className="gap-1.5 shrink-0"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CornerDownLeft className="size-4" />
            )}
            Run
          </Button>
        </div>

        {/* AI Output Result Box */}
        {result && (
          <div className="flex-1 flex flex-col min-h-40 max-h-80 overflow-hidden rounded-md border bg-muted/30">
            <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50 text-xs text-muted-foreground">
              <span className="font-medium">
                {isMermaid ? "Architecture Diagram" : "AI Response"}
              </span>
              <div className="flex items-center gap-2">
                {isMermaid && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewRaw(!viewRaw)}
                    className="h-6 px-2 text-xs"
                  >
                    {viewRaw ? "Preview Diagram" : "View Code"}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 px-2 text-xs gap-1"
                >
                  {copied ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1">
              {isMermaid && !viewRaw ? (
                <MermaidViewer chart={result} className="my-0 border-0 p-0 shadow-none bg-transparent" />
              ) : (
                <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
                  {result}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-2.5 border-t bg-card">
              {selectedText ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleInsert(true)}
                  className="text-xs"
                >
                  Replace Selection
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                onClick={() => handleInsert(false)}
                className="text-xs gap-1"
              >
                Insert into Note
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
