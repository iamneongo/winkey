import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function POST(req: Request) {
  try {
    const { orgRole } = await auth();
    if (orgRole !== 'org:admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, content, category, is_published, sort_order } = body;

    if (!title || !content) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    await ensureDatabaseReady();

    // Check slug uniqueness
    while (true) {
      const { rows } = await db.query('SELECT id FROM guides WHERE slug = $1', [slug]);
      if (rows.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { rows } = await db.query(
      `INSERT INTO guides (title, slug, content, category, is_published, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, slug, content, category || 'general', is_published || false, sort_order || 0]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating guide:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
