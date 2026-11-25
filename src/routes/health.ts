import { sql } from 'drizzle-orm';
import { Elysia } from 'elysia';
import { getDb } from '../db';

export const healthRoutes = new Elysia({ prefix: '/health' }).get('/', async () => {
  if (!process.env.DATABASE_URL) {
    return { status: 'ok', database: 'not_configured' };
  }

  try {
    await getDb().execute(sql`SELECT 1`);
    return { status: 'ok', database: 'connected' };
  } catch {
    return { status: 'ok', database: 'disconnected' };
  }
});
