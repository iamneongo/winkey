import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUnreadCount } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { orgRole } = await auth();
  if (orgRole !== 'org:admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const count = await getUnreadCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
