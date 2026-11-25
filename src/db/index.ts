import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let cachedDb: PostgresJsDatabase<typeof schema> | null = null;

/**
 * Returns a lazily initialized Drizzle database instance for PostgreSQL.
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (cachedDb) return cachedDb;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(databaseUrl);
  cachedDb = drizzle(client, { schema });
  return cachedDb;
}
