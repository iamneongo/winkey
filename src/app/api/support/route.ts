import { NextRequest, NextResponse } from 'next/server';
import { createSupportRequestInDb } from '@/lib/catalog';
import { supportRequestSchema } from '@/lib/api-schemas';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = supportRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Dữ liệu yêu cầu hỗ trợ không hợp lệ.'
      },
      { status: 400 }
    );
  }

  const data = await createSupportRequestInDb(parsed.data);
  return NextResponse.json(data, { status: 201 });
}
