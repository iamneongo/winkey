import { NextResponse } from 'next/server';
import { getUploadedImage } from '@/lib/uploaded-images';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Serve admin-uploaded images stored in Postgres (Neon). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ success: false, message: 'Ảnh không hợp lệ.' }, { status: 400 });
    }

    const image = await getUploadedImage(id);
    if (!image) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy ảnh.' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(image.data), {
      status: 200,
      headers: {
        'Content-Type': image.mimeType,
        // Content is immutable per id (a re-upload creates a new id).
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Serve uploaded image failed:', error);
    return NextResponse.json({ success: false, message: 'Không thể tải ảnh.' }, { status: 500 });
  }
}
