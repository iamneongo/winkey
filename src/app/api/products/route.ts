import { NextRequest, NextResponse } from 'next/server';
import { createProductInDb, getProductsFromDb } from '@/lib/catalog';
import { productMutationSchema } from '@/lib/api-schemas';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const categories = searchParams.get('categories') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await getProductsFromDb({
    page,
    limit,
    categories,
    search,
    sort
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = productMutationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Dữ liệu sản phẩm không hợp lệ.'
      },
      { status: 400 }
    );
  }

  const data = await createProductInDb(parsed.data);
  return NextResponse.json(data, { status: 201 });
}
