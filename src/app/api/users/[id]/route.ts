// ============================================================
// Route Handler — Single User (update + delete)
// ============================================================
// See src/app/api/users/route.ts for pattern documentation.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { deleteUserInDb, updateUserInDb } from '@/lib/catalog';

type Params = { params: Promise<{ id: string }> };

export const runtime = 'nodejs';

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const data = await updateUserInDb(Number(id), body);

  if (!data.success) {
    return NextResponse.json(data, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await deleteUserInDb(Number(id));

  if (!data.success) {
    return NextResponse.json(data, { status: 404 });
  }

  return NextResponse.json(data);
}
