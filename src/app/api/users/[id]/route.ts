import { NextRequest, NextResponse } from 'next/server';
import { deleteUserInDb, updateUserInDb } from '@/lib/catalog';
import { userMutationSchema } from '@/lib/api-schemas';

type Params = { params: Promise<{ id: string }> };

export const runtime = 'nodejs';

function parseId(id: string) {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = parseId(id);

  if (!numericId) {
    return NextResponse.json({ success: false, message: 'Mã người dùng không hợp lệ.' }, { status: 400 });
  }

  const body = await request.json();
  const parsed = userMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Dữ liệu người dùng không hợp lệ.' },
      { status: 400 }
    );
  }

  const data = await updateUserInDb(numericId, parsed.data);
  return NextResponse.json(data, { status: data.success ? 200 : 404 });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = parseId(id);

  if (!numericId) {
    return NextResponse.json({ success: false, message: 'Mã người dùng không hợp lệ.' }, { status: 400 });
  }

  const data = await deleteUserInDb(numericId);
  return NextResponse.json(data, { status: data.success ? 200 : 404 });
}
