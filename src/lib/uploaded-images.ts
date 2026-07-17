import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';

/**
 * Admin image uploads stored directly in Postgres (Neon).
 *
 * Vercel's serverless filesystem is read-only and the project does not use
 * Vercel Blob, so image bytes live in an `uploaded_images` table and are
 * served through GET /api/uploads/images/[id].
 */

export const UPLOADED_IMAGE_URL_PREFIX = '/api/uploads/images/';

export type UploadedImageFolder = 'products' | 'blogs';

let ensurePromise: Promise<void> | null = null;

export function ensureUploadedImagesTable(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = db
      .query(
        `CREATE TABLE IF NOT EXISTS uploaded_images (
           id TEXT PRIMARY KEY,
           folder TEXT NOT NULL,
           filename TEXT NOT NULL DEFAULT '',
           mime_type TEXT NOT NULL,
           data BYTEA NOT NULL,
           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )`
      )
      .then(() => undefined)
      .catch((error) => {
        // Allow a retry on the next request instead of caching the failure.
        ensurePromise = null;
        throw error;
      });
  }
  return ensurePromise;
}

export async function saveUploadedImage(params: {
  folder: UploadedImageFolder;
  filename: string;
  mimeType: string;
  data: Buffer;
}): Promise<string> {
  await ensureUploadedImagesTable();

  const id = randomUUID();
  await db.query(
    `INSERT INTO uploaded_images (id, folder, filename, mime_type, data)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, params.folder, params.filename, params.mimeType, params.data]
  );

  return `${UPLOADED_IMAGE_URL_PREFIX}${id}`;
}

export async function getUploadedImage(
  id: string
): Promise<{ mimeType: string; data: Buffer } | null> {
  await ensureUploadedImagesTable();

  const { rows } = await db.query<{ mime_type: string; data: Buffer }>(
    'SELECT mime_type, data FROM uploaded_images WHERE id = $1',
    [id]
  );
  if (rows.length === 0) return null;
  return { mimeType: rows[0].mime_type, data: rows[0].data };
}

/** Extract the image id from a managed upload URL, or null if not a managed URL. */
export function parseUploadedImageUrl(url: string): string | null {
  if (!url.startsWith(UPLOADED_IMAGE_URL_PREFIX)) return null;
  const id = url.slice(UPLOADED_IMAGE_URL_PREFIX.length);
  // UUIDs only — reject anything with path separators or query strings.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return id;
}

export async function deleteUploadedImage(id: string): Promise<void> {
  await ensureUploadedImagesTable();
  await db.query('DELETE FROM uploaded_images WHERE id = $1', [id]);
}
