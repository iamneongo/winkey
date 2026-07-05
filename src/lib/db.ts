import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL. Add it to .env.local before starting the app.');
}

const globalForDb = globalThis as typeof globalThis & {
  __winkeyPool?: Pool;
};

export const db =
  globalForDb.__winkeyPool ??
  new Pool({
    connectionString,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__winkeyPool = db;
}
