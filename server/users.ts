"use server";

import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";

// Map internal better-auth errors to user-safe messages.
function friendlyAuthError(error: unknown, fallback: string): string {
    if (error instanceof APIError) {
        switch (error.status) {
            case "UNAUTHORIZED":
            case "FORBIDDEN":
                return "Invalid email or password";
            case "BAD_REQUEST":
                return error.message || fallback;
            case "INTERNAL_SERVER_ERROR":
                return "Something went wrong on our end. Please try again later.";
            default:
                return error.message || fallback;
        }
    }
    return fallback;
}

export const signInUser = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            },
        });

        return { success: true, message: "Signed in successfully" };
    } catch (error) {
        console.error("[signInUser]", error);
        return {
            success: false,
            message: friendlyAuthError(error, "Failed to sign in"),
        };
    }
};

export const signUpUser = async (email: string, password: string, name: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
        });

        return { success: true, message: "Signed up successfully" };
    } catch (error) {
        console.error("[signUpUser]", error);
        return {
            success: false,
            message: friendlyAuthError(error, "Failed to sign up"),
        };
    }
};