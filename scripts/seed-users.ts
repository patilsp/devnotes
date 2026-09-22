/**
 * Seeds the dummy admin account.
 *
 * Usage:
 *   pnpm db:seed             # upsert admin@gmail.com (idempotent)
 *   pnpm db:reset            # delete every existing user first, then seed
 *
 * Idempotent: safe to run multiple times. Refreshes the password if the user
 * already exists, and marks the account email-verified so it can log in
 * without an email verification step.
 *
 * `--reset` cascades: deleting a user also removes its sessions, credential
 * accounts, notebooks, and notes.
 */
import { hashPassword } from "better-auth/crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { config } from "dotenv";

// Load sandbox env (DATABASE_URL, ...) before connecting.
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { user, account } from "../db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env (dev) or the environment.");
  process.exit(1);
}

const SEED_USERS = [
  { email: "admin@gmail.com", name: "Admin", password: "Password@01" },
];

// better-auth 1.7 scopes account identities by issuer.
const CREDENTIAL_ISSUER = "local:credential";

const reset = process.argv.includes("--reset");

async function seed() {
  const db = drizzle(DATABASE_URL!);

  if (reset) {
    console.log(
      "Deleting all existing users (sessions, credential accounts, notebooks and notes cascade)..."
    );
    const deleted = await db.delete(user).returning({ email: user.email });
    console.log(
      `Deleted ${deleted.length} user(s): ${deleted.map((u) => u.email).join(", ") || "(none)"}\n`
    );
  }

  for (const seedUser of SEED_USERS) {
    const hashedPassword = await hashPassword(seedUser.password);

    // Upsert the user row.
    const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.email, seedUser.email))
      .limit(1);

    let userId: string;
    if (existing) {
      userId = existing.id;
      await db
        .update(user)
        .set({ name: seedUser.name, emailVerified: true, updatedAt: new Date() })
        .where(eq(user.id, userId));
      console.log(`Updated user ${seedUser.email}`);
    } else {
      const [created] = await db
        .insert(user)
        .values({
          id: crypto.randomUUID(),
          email: seedUser.email,
          name: seedUser.name,
          emailVerified: true,
        })
        .returning({ id: user.id });
      userId = created.id;
      console.log(`Created user ${seedUser.email}`);
    }

    // Upsert the email/password credential account.
    const [existingAccount] = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    if (existingAccount) {
      await db
        .update(account)
        .set({
          password: hashedPassword,
          accountId: userId,
          providerId: "credential",
          issuer: CREDENTIAL_ISSUER,
          updatedAt: new Date(),
        })
        .where(eq(account.id, existingAccount.id));
      console.log(`  Refreshed password for ${seedUser.email}`);
    } else {
      await db.insert(account).values({
        id: crypto.randomUUID(),
        userId,
        accountId: userId,
        providerId: "credential",
        issuer: CREDENTIAL_ISSUER,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  Created credential account for ${seedUser.email}`);
    }
  }

  console.log("\nSeeded accounts:");
  for (const u of SEED_USERS) {
    console.log(`  ${u.email} / ${u.password}`);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
