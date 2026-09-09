import PasswordResetEmail from "@/components/emails/reset-email";
import VerificationEmail from "@/components/emails/verification-email";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Public origin of the app (no trailing slash). Used for OAuth redirects,
// email verification links, and password reset links.
const baseURL = (
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? ""
).replace(/\/$/, "");

export const auth = betterAuth({
  // Without a secret the auth instance throws on initialization
  // ("You are using the default secret"), which breaks every auth route.
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: baseURL || undefined,
  trustedOrigins: baseURL ? [baseURL] : undefined,
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (!process.env.RESEND_API_KEY) {
        console.warn(
          `[auth] RESEND_API_KEY is not set. Skipping verification email to ${user.email}. Verification URL: ${url}`
        );
        return;
      }
      await resend.emails.send({
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
      if (!process.env.RESEND_API_KEY) {
        console.warn(
          `[auth] RESEND_API_KEY is not set. Skipping reset email to ${user.email}. Reset URL: ${url}`
        );
        return;
      }
      await resend.emails.send({
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
