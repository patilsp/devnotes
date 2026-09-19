import PasswordResetEmail from "@/components/emails/reset-email";
import VerificationEmail from "@/components/emails/verification-email";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

// Without a secret the auth instance throws on initialization
// ("You are using the default secret"), which breaks every auth route.
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and add it in Settings → Environment (workspace) or your deploy env vars."
  );
}

// Lazily create the Resend client so a missing RESEND_API_KEY does not crash
// auth routes at module load — emails are skipped with a warning instead.
let resend: Resend | null = null;
function getEmailClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// Public origin of the app (no trailing slash). Used for OAuth redirects,
// email verification links, and password reset links.
const baseURL = (
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? ""
).replace(/\/$/, "");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: baseURL || undefined,
  trustedOrigins: baseURL ? [baseURL] : undefined,
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const client = getEmailClient();
      if (!client) {
        console.warn(
          `[auth] RESEND_API_KEY is not set. Skipping verification email to ${user.email}. Verification URL: ${url}`
        );
        return;
      }
      await client.emails.send({
        from: "DevNotes <onboarding@resend.dev>",
        to: [user.email],
        subject: "Verify your email address",
        react: VerificationEmail({ userName: user.name, verificationUrl: url }),
      });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const client = getEmailClient();
      if (!client) {
        console.warn(
          `[auth] RESEND_API_KEY is not set. Skipping reset email to ${user.email}. Reset URL: ${url}`
        );
        return;
      }
      await client.emails.send({
        from: "DevNotes <onboarding@resend.dev>",
        to: [user.email],
        subject: "Reset your password",
        react: PasswordResetEmail({
          userName: user.name,
          resetUrl: url,
          requestTime: new Date().toLocaleString(),
        }),
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [nextCookies()],
});
