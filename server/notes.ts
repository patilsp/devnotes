"use server";

import { db } from "@/db/drizzle";
import { InsertNote, notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { actionError } from "./action-error";

export const createNote = async (values: InsertNote) => {
    try {
        await db.insert(notes).values(values);
        return { success: true, message: "Note created successfully" };
    } catch (error) {
        return { success: false, message: actionError("createNote", error, "Failed to create note") };
    }
};

export const getNoteById = async (id: string) => {
    try {
        const note = await db.query.notes.findFirst({
            where: eq(notes.id, id),
            with: {
                notebook: true
            }
        });

        return { success: true, note };
    } catch (error) {
        return { success: false, message: actionError("getNoteById", error, "Failed to get note") };
    }
};

export const updateNote = async (id: string, values: Partial<InsertNote>) => {
    try {
        await db.update(notes).set(values).where(eq(notes.id, id));
        return { success: true, message: "Note updated successfully" };
    } catch (error) {
        return { success: false, message: actionError("updateNote", error, "Failed to update note") };
    }
};

export const deleteNote = async (id: string) => {
    try {
        await db.delete(notes).where(eq(notes.id, id));
        return { success: true, message: "Note deleted successfully" };
    } catch (error) {
        return { success: false, message: actionError("deleteNote", error, "Failed to delete note") };
    }
};
