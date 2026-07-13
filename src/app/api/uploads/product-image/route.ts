import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { managedUploadDeleteSchema } from '@/lib/api-schemas';
import { requireAdmin } from '@/lib/api-auth';
import { put } from '@vercel/blob';

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
const UPLOAD_PREFIX = '/uploads/products/';

function getExtension(file: File) {
  if (file.type === 'image/jpeg') return '.jpg';
  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/webp') return '.webp';
  if (file.type === 'image/gif') return '.gif';
  if (file.type === 'image/avif') return '.avif';
  if (file.type === 'image/svg+xml') return '.svg';

  const ext = path.extname(file.name || '').toLowerCase();
  return ext || '.png';
}

function resolveManagedUploadPath(url: string) {
  if (!url.startsWith(UPLOAD_PREFIX)) {
    return null;
  }

  const fileName = url.slice(UPLOAD_PREFIX.length);
  if (!fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return null;
  }

  return path.join(process.cwd(), 'public', 'uploads', 'products', fileName);
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

    // if no BLOB_READ_WRITE_TOKEN, mock the upload
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // The local fallback writes to public/uploads, which only works in local dev.
      // On Vercel the serverless filesystem is read-only and runtime files in
      // public/ are never served, so fail fast with an actionable message.
      if (process.env.VERCEL) {
        console.error('Upload failed: BLOB_READ_WRITE_TOKEN is not configured on this deployment.');
        return NextResponse.json(
          {
            success: false,
            message:
              'Máy chủ chưa cấu hình kho lưu trữ ảnh (thiếu BLOB_READ_WRITE_TOKEN). Hãy kết nối Vercel Blob Store cho project rồi deploy lại.'
          },
          { status: 500 }
        );
      }

      console.warn('BLOB_READ_WRITE_TOKEN missing. Using local mock for product image.');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      await mkdir(uploadDir, { recursive: true });
      const extension = getExtension(file);
      const filename = `${Date.now()}-${randomUUID()}${extension}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: 'Đã upload ảnh sản phẩm (local fallback).',
        url: `${UPLOAD_PREFIX}${filename}`
      });
    }

    const extension = getExtension(file);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    
    const blob = await put(`products/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({
      success: true,
      message: 'Đã upload ảnh sản phẩm.',
      url: blob.url
    });
  } catch (error) {
    console.error('Product image upload failed:', error);
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

    const filePath = resolveManagedUploadPath(parsed.data.url);
    if (!filePath) {
      return NextResponse.json(
        { success: false, message: 'Chỉ có thể xóa ảnh đã upload từ admin.' },
        { status: 400 }
      );
    }

    await rm(filePath, { force: true });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa ảnh sản phẩm.'
    });
  } catch (error) {
    console.error('Product image delete failed:', error);
    return NextResponse.json(
      { success: false, message: 'Xóa ảnh thất bại.' },
      { status: 500 }
    );
  }
}
