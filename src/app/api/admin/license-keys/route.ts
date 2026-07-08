import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { addLicenseKeys, getLicenseKeyStats } from '@/lib/catalog';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { orgRole } = await auth();
    const user = await currentUser();

    if (!user || orgRole !== 'org:admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, keys } = body;

    if (!productId || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const insertedCount = await addLicenseKeys(productId, keys);

    return NextResponse.json({ success: true, count: insertedCount });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Add License Keys Error:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { orgRole } = await auth();
    const user = await currentUser();

    if (!user || orgRole !== 'org:admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const stats = await getLicenseKeyStats(Number(productId));

    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Get License Key Stats Error:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
