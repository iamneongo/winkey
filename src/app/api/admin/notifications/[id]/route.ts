import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { markAsRead } from '@/lib/notifications';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { orgRole } = await auth();
  if (orgRole !== 'org:admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await markAsRead(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
