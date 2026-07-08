import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';
import Link from 'next/link';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/tai-khoan');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/auth/sign-in?redirect_url=/tai-khoan');
  }

  await ensureDatabaseReady();

  const email = user.emailAddresses[0]?.emailAddress;

  // Sync customer to database
  await db.query(
    `INSERT INTO customers (clerk_id, first_name, last_name, email)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (clerk_id) DO UPDATE 
     SET first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         email = EXCLUDED.email,
         updated_at = NOW()`,
    [userId, user.firstName || '', user.lastName || '', email || '']
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              <Link href="/tai-khoan" className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 font-medium">Tổng quan</Link>
              <Link href="/tai-khoan/don-hang" className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 font-medium">Đơn hàng của tôi</Link>
              <Link href="/tai-khoan/affiliate" className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 font-medium">Cộng tác viên (Affiliate)</Link>
            </nav>
          </aside>
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
