import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { orgRole } = await auth();
    if (orgRole !== 'org:admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { title, content, category, is_published, sort_order } = body;

    const { rows } = await db.query(
      `UPDATE guides 
       SET title = $1, content = $2, category = $3, is_published = $4, sort_order = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, content, category || 'general', is_published || false, sort_order || 0, parseInt(id, 10)]
    );

    if (rows.length === 0) return new NextResponse('Not found', { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating guide:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { orgRole } = await auth();
    if (orgRole !== 'org:admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    await db.query('DELETE FROM guides WHERE id = $1', [parseInt(id, 10)]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
