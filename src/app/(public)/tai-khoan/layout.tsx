import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';
import { AccountNav } from './account-nav';

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
    <div className="min-h-screen bg-gray-50 pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
          <aside className="w-full shrink-0 xl:w-64">
            <AccountNav />
          </aside>
          <main className="min-w-0 flex-1 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
