import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Add it in Settings → Environment (workspace) or your deploy env vars, then restart the app.'
  );
}

export const db = drizzle(databaseUrl, { schema });
