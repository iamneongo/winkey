import { Pool } from 'pg';

export class DatabaseConfigError extends Error {
  constructor(message = 'Missing DATABASE_URL. Add it to your local env or Vercel project settings.') {
    super(message);
    this.name = 'DatabaseConfigError';
  }
}

const globalForDb = globalThis as typeof globalThis & {
  __winkeyPool?: Pool;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new DatabaseConfigError();
  }

  return new Pool({
    connectionString,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000
  });
}

export function getDb() {
  if (!globalForDb.__winkeyPool) {
    globalForDb.__winkeyPool = createPool();
  }

  return globalForDb.__winkeyPool;
}

export const db = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const pool = getDb();
    const value = Reflect.get(pool, prop, receiver);
    return typeof value === 'function' ? value.bind(pool) : value;
  }
});
