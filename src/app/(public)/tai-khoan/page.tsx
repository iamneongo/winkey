import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || '';

  await ensureDatabaseReady();
  const { rows } = await db.query(
    'SELECT * FROM customers WHERE clerk_id = $1',
    [userId]
  );
  
  const customer = rows[0] || {};
  // Fallback to clerk info if customer is not found
  const firstName = customer.first_name ?? user?.firstName ?? '';
  const lastName = customer.last_name ?? user?.lastName ?? '';
  const phone = customer.phone ?? '';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <div className="bg-white p-6 rounded-lg border">
        <ProfileForm 
          initialFirstName={firstName}
          initialLastName={lastName}
          initialPhone={phone}
          email={email}
        />
      </div>
    </div>
  );
}
