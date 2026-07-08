import { NextRequest, NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/catalog';
import { blogMutationSchema } from '@/lib/api-schemas';
import { requireAdmin } from '@/lib/api-auth';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const data = await getBlogs({ page, limit, publishedOnly });
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const validatedData = blogMutationSchema.parse(body);

    const newBlog = await createBlog(validatedData);
    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
