import { rm } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { managedUploadDeleteSchema } from '@/lib/api-schemas';
import { requireAdmin } from '@/lib/api-auth';
import {
  deleteUploadedImage,
  parseUploadedImageUrl,
  saveUploadedImage
} from '@/lib/uploaded-images';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml'
]);
// Legacy prefix from the old filesystem-based uploads (kept so DELETE still works
// for images uploaded before the switch to database storage).
const LEGACY_UPLOAD_PREFIX = '/uploads/blogs/';

function resolveLegacyUploadPath(url: string) {
  if (!url.startsWith(LEGACY_UPLOAD_PREFIX)) {
    return null;
  }

  const fileName = url.slice(LEGACY_UPLOAD_PREFIX.length);
  if (!fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return null;
  }

  return path.join(process.cwd(), 'public', 'uploads', 'blogs', fileName);
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    value !== null &&
    typeof value !== 'string' &&
    typeof value.arrayBuffer === 'function' &&
    typeof value.type === 'string' &&
    typeof value.size === 'number'
  );
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!isUploadFile(file)) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy file upload.' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ success: false, message: 'File ảnh đang trống.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Chỉ hỗ trợ JPG, PNG, WEBP, GIF, AVIF hoặc SVG.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ảnh vượt quá giới hạn 5MB.' },
        { status: 400 }
      );
    }

    // Store image bytes in Postgres (Neon) — works identically in local dev and
    // on Vercel (whose serverless filesystem is read-only).
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedImage({
      folder: 'blogs',
      filename: file.name ?? '',
      mimeType: file.type,
      data: buffer
    });

    return NextResponse.json({
      success: true,
      message: 'Đã upload ảnh blog.',
      url
    });
  } catch (error) {
    console.error('Blog image upload failed:', error);
    return NextResponse.json(
      { success: false, message: 'Upload ảnh thất bại.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = managedUploadDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? 'Thiếu đường dẫn ảnh cần xóa.' },
        { status: 400 }
      );
    }

    // New database-backed uploads
    const imageId = parseUploadedImageUrl(parsed.data.url);
    if (imageId) {
      await deleteUploadedImage(imageId);
      return NextResponse.json({ success: true, message: 'Đã xóa ảnh blog.' });
    }

    // Legacy filesystem uploads (local dev era)
    const filePath = resolveLegacyUploadPath(parsed.data.url);
    if (!filePath) {
      return NextResponse.json(
        { success: false, message: 'Chỉ có thể xóa ảnh đã upload từ admin.' },
        { status: 400 }
      );
    }

    await rm(filePath, { force: true });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa ảnh blog.'
    });
  } catch (error) {
    console.error('Blog image delete failed:', error);
    return NextResponse.json(
      { success: false, message: 'Xóa ảnh thất bại.' },
      { status: 500 }
    );
  }
}
