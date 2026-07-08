import { NextRequest, NextResponse } from 'next/server';
import { createUserInDb, getUsersFromDb } from '@/lib/catalog';
import { userMutationSchema } from '@/lib/api-schemas';
import { requireAdmin } from '@/lib/api-auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const roles = searchParams.get('roles') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await getUsersFromDb({
    page,
    limit,
    roles,
    search,
    sort
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = userMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Dữ liệu người dùng không hợp lệ.'
      },
      { status: 400 }
    );
  }

  const data = await createUserInDb(parsed.data);
  return NextResponse.json(data, { status: 201 });
}
