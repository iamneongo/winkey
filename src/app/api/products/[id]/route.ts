import { NextRequest, NextResponse } from 'next/server';
import {
  deleteProductInDb,
  getProductByIdFromDb,
  updateProductInDb
} from '@/lib/catalog';
import { productMutationSchema } from '@/lib/api-schemas';
import { requireAdmin } from '@/lib/api-auth';

type Params = { params: Promise<{ id: string }> };

export const runtime = 'nodejs';

function parseId(id: string) {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = parseId(id);

  if (!numericId) {
    return NextResponse.json({ success: false, message: 'Mã sản phẩm không hợp lệ.' }, { status: 400 });
  }

  const data = await getProductByIdFromDb(numericId);
  return NextResponse.json(data, { status: data.success ? 200 : 404 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const numericId = parseId(id);

  if (!numericId) {
    return NextResponse.json({ success: false, message: 'Mã sản phẩm không hợp lệ.' }, { status: 400 });
  }

  const body = await request.json();
  const parsed = productMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Dữ liệu sản phẩm không hợp lệ.' },
      { status: 400 }
    );
  }

  const data = await updateProductInDb(numericId, parsed.data);
  return NextResponse.json(data, { status: data.success ? 200 : 404 });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const numericId = parseId(id);

  if (!numericId) {
    return NextResponse.json({ success: false, message: 'Mã sản phẩm không hợp lệ.' }, { status: 400 });
  }

  const data = await deleteProductInDb(numericId);
  return NextResponse.json(data, { status: data.success ? 200 : 404 });
}
