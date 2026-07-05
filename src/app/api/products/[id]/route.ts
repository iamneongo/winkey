// ============================================================
// Route Handler — Single Product (get + update)
// ============================================================
// See src/app/api/products/route.ts for pattern documentation.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  deleteProductInDb,
  getProductByIdFromDb,
  updateProductInDb
} from '@/lib/catalog';

type Params = { params: Promise<{ id: string }> };

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await getProductByIdFromDb(Number(id));

  if (!data.success) {
    return NextResponse.json(data, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const data = await updateProductInDb(Number(id), body);

  if (!data.success) {
    return NextResponse.json(data, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await deleteProductInDb(Number(id));

  if (!data.success) {
    return NextResponse.json(data, { status: 404 });
  }

  return NextResponse.json(data);
}
