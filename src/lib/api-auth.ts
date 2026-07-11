import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const { userId, orgRole } = await auth();

  if (!userId || orgRole !== 'org:admin') {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: !userId
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          : 'Bạn cần chọn workspace với vai trò Admin trước khi upload.'
      },
      { status: 401 }
    );
  }

  return null;
}
