import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getBlog, deleteBlog } from '@/lib/catalog';

// Decision: We only delete the DB record. Any associated uploaded files (cover_url)
// stored on external services (e.g. Uploadthing/S3) are NOT deleted here to avoid
// accidental removal of assets that may be referenced elsewhere. If clean-up is
// needed, it should be handled by a scheduled background job.

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { orgRole } = await auth();

    if (orgRole !== 'org:admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const existing = await getBlog(id);
    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    await deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/blogs/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
