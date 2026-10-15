import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { notebooks } from "@/db/schema";
import { eq } from "drizzle-orm";

interface NoteSummary {
  id: string;
  notebookId: string;
  notebookName: string;
  title: string;
  snippet: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { question, messages = [] } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // 1. Fetch user's notebooks and notes from database
    const userNotebooks = await db.query.notebooks.findMany({
      where: eq(notebooks.userId, userId),
      with: {
        notes: true,
      },
    });

    // 2. Extract plain text content and index notes for context retrieval
    const indexedNotes: NoteSummary[] = [];

    for (const nb of userNotebooks) {
      for (const n of nb.notes) {
        let plainText = "";
        if (n.content) {
          try {
            plainText = extractPlainText(n.content);
          } catch {
            plainText = typeof n.content === "string" ? n.content : "";
          }
        }

        indexedNotes.push({
          id: n.id,
          notebookId: nb.id,
          notebookName: nb.name,
          title: n.title,
          snippet: plainText.slice(0, 1500), // First 1500 chars for context window balance
        });
      }
    }

    // 3. Score and rank relevant notes based on keyword match
    const qWords = question
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const scoredNotes = indexedNotes.map((item) => {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerSnippet = item.snippet.toLowerCase();

      for (const word of qWords) {
        if (lowerTitle.includes(word)) score += 5;
        if (lowerSnippet.includes(word)) score += 1;
      }
      return { ...item, score };
    });

    // Take top matching notes, or first 5 if no specific keyword match
    scoredNotes.sort((a, b) => b.score - a.score);
    const relevantNotes = scoredNotes.slice(0, 5);

    // 4. Build context string
    const notesContext = relevantNotes
      .map(
        (n, i) =>
          `[Note #${i + 1}] Title: "${n.title}" (Notebook: "${n.notebookName}")\nNote ID: ${n.id} | Notebook ID: ${n.notebookId}\nContent:\n${n.snippet || "(Empty note)"}\n---`
      )
      .join("\n\n");

    const systemPrompt = `You are "DevNotes Copilot", an AI knowledge base assistant that knows everything inside the user's notebooks and notes.
Answer the user's questions accurately based on their notes.
When you reference information from their notes, ALWAYS cite the note title and include a reference chip format: [[Note: <Note Title> | id: <noteId> | nb: <notebookId>]].
If the answer is not found in the provided notes, say so politely, but provide any relevant developer insight you can.
Keep your response concise, helpful, and developer-friendly.`;

    const promptText = `User's Notes Knowledge Base:
${notesContext || "User currently has no saved notes or notes are empty."}

User Question: "${question}"

Provide a direct answer with citations to the specific notes where relevant.`;

    const geminiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let responseText = "";

    if (geminiKey) {
      const result = await generateText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        prompt: promptText,
      });
      responseText = result.text;
    } else if (openaiKey) {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        prompt: promptText,
      });
      responseText = result.text;
    } else {
      // Offline fallback: synthesize based on available matching notes
      if (relevantNotes.length > 0 && relevantNotes[0].score > 0) {
        const top = relevantNotes[0];
        responseText = `Based on your notes in **${top.notebookName}**, here is what I found regarding "${question}":\n\n- In note **[[Note: ${top.title} | id: ${top.id} | nb: ${top.notebookId}]]**:\n> ${top.snippet.slice(0, 200)}...\n\n*Tip: Connect your \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` in \`.env\` for comprehensive RAG syntheses and Q&A across your entire workspace.*`;
      } else if (indexedNotes.length > 0) {
        responseText = `I searched across your **${indexedNotes.length}** note(s), but found no direct matches for "${question}".\n\nHere are some of your available notes you can ask about:\n${indexedNotes
          .slice(0, 3)
          .map((n) => `- [[Note: ${n.title} | id: ${n.id} | nb: ${n.notebookId}]] in *${n.notebookName}*`)
          .join("\n")}`;
      } else {
        responseText = `You don't have any notes in your DevNotes account yet! Create a notebook and your first note to start chatting with your knowledge base.`;
      }
    }

    return NextResponse.json({
      answer: responseText,
      citations: relevantNotes.map((n) => ({
        id: n.id,
        notebookId: n.notebookId,
        notebookName: n.notebookName,
        title: n.title,
      })),
    });
  } catch (error) {
    console.error("Chat notes error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper to extract text from Tiptap JSON or string
function extractPlainText(content: unknown): string {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return extractFromNode(parsed);
    } catch {
      return content;
    }
  }
  return extractFromNode(content);
}

function extractFromNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;

  let text = "";
  if (n.text && typeof n.text === "string") {
    text += n.text + " ";
  }

  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      text += extractFromNode(child);
    }
  }

  return text;
}
