-- better-auth 1.7 scopes account identities by issuer. The Drizzle schema needs
-- the column, so keep this migration safe on databases that already have rows
-- (backfill email/password accounts with the local credential issuer first).
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" text;--> statement-breakpoint
UPDATE "account" SET "issuer" = 'local:credential' WHERE "issuer" IS NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;
