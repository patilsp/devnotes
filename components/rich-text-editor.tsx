"use client";

import { useState, useEffect } from "react";
import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Terminal,
  Sparkles,
  List,
  ListOrdered,
  ChevronDown,
} from "lucide-react";
import { updateNote } from "@/server/notes";
import { AIAssistantModal } from "@/components/ai-assistant-modal";

const lowlight = createLowlight(common);

const SUPPORTED_LANGUAGES = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Bash / Shell", value: "bash" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "SQL", value: "sql" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Markdown", value: "markdown" },
];

interface RichTextEditorProps {
  content?: JSONContent[];
  noteId?: string;
}

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "typescript",
      }),
      Document,
      Paragraph,
      Text,
    ],
    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (noteId) {
        const content = editor.getJSON();
        updateNote(noteId, { content });
      }
    },
    content: content ?? {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Getting started" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Welcome to the " },
            {
              type: "text",
              text: "Simple Editor",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " template! This template integrates " },
            { type: "text", text: "open source", marks: [{ type: "bold" }] },
            {
              type: "text",
              text: " UI components and Tiptap extensions licensed under ",
            },
            { type: "text", text: "MIT", marks: [{ type: "bold" }] },
            { type: "text", text: "." },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Integrate it by following the " },
            {
              type: "text",
              text: "Tiptap UI Components docs",
              marks: [{ type: "code" }],
            },
            { type: "text", text: " or using our CLI tool." },
          ],
        },
        {
          type: "codeBlock",
          content: [{ type: "text", text: "npx @tiptap/cli init" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Features" }],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown ",
                },
                { type: "text", text: "**", marks: [{ type: "bold" }] },
                { type: "text", text: " or use keyboard shortcuts " },
                { type: "text", text: "⌘+B", marks: [{ type: "code" }] },
                { type: "text", text: " for most all common markdown marks." },
              ],
            },
          ],
        },
      ],
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor?.isActive("bold"),
        canBold: ctx.editor?.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor?.isActive("italic"),
        canItalic: ctx.editor?.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor?.isActive("strike"),
        canStrike: ctx.editor?.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor?.isActive("code"),
        canCode: ctx.editor?.can().chain().focus().toggleCode().run(),
        isParagraph: ctx.editor?.isActive("paragraph"),
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isOrderedList: ctx.editor?.isActive("orderedList"),
        isCodeBlock: ctx.editor?.isActive("codeBlock"),
        isBlockquote: ctx.editor?.isActive("blockquote"),
        canUndo: ctx.editor?.can().chain().focus().undo().run(),
        canRedo: ctx.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  const getActiveHeading = () => {
    if (editorState?.isHeading1) return "H1";
    if (editorState?.isHeading2) return "H2";
    if (editorState?.isHeading3) return "H3";
    return "H1";
  };

  const openAIAssistant = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const selected = from !== to ? editor.state.doc.textBetween(from, to, " ") : "";
      setSelectedText(selected);
    }
    setAiOpen(true);
  };

  const handleAIInsert = (text: string, replaceSelection?: boolean) => {
    if (!editor) return;
    if (replaceSelection) {
      editor.chain().focus().insertContent(text).run();
    } else {
      editor.chain().focus().insertContent(`\n${text}\n`).run();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openAIAssistant();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  return (
    <div className="w-full max-w-7xl bg-card text-card-foreground rounded-lg overflow-hidden border">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
            >
              {getActiveHeading()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border">
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isBulletList
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isOrderedList
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isBold
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isItalic
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isStrike
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Inline Code"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editorState?.canCode}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isCode
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Code Block"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isCodeBlock
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="h-4 w-4" />
        </Button>

        {/* Code Block Language Selector */}
        {editorState?.isCodeBlock && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1 font-mono bg-background"
              >
                <Terminal className="h-3 w-3 text-primary" />
                {editor?.getAttributes("codeBlock").language || "auto"}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-56 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .updateAttributes("codeBlock", { language: lang.value })
                      .run()
                  }
                  className="text-xs font-mono"
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Ask AI Assistant */}
        <Button
          variant="outline"
          size="sm"
          onClick={openAIAssistant}
          className="h-8 px-2.5 text-xs font-medium gap-1.5 border-primary/30 text-primary hover:bg-primary/10 shadow-2xs"
          title="Ask DevNotes AI Assistant (Ctrl+J)"
        >
          <Sparkles className="size-3.5 text-primary" />
          <span>Ask AI</span>
          <kbd className="hidden sm:inline-block rounded border bg-muted/80 px-1 text-[9px] text-muted-foreground">
            Ctrl+J
          </kbd>
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-96 p-6 bg-card">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded"
        />
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        open={aiOpen}
        onOpenChange={setAiOpen}
        selectedText={selectedText}
        fullNoteText={editor?.getText() || ""}
        onInsert={handleAIInsert}
      />
    </div>
  );
};

export default RichTextEditor;
