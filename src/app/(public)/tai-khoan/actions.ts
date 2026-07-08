'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await currentUser();
  if (!user) throw new Error('User not found');

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const phone = formData.get('phone') as string;
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error('Email not found');

  await ensureDatabaseReady();

  // Upsert customer based on clerk_id
  await db.query(
    `INSERT INTO customers (clerk_id, email, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (clerk_id) DO UPDATE 
     SET first_name = EXCLUDED.first_name, 
         last_name = EXCLUDED.last_name, 
         phone = EXCLUDED.phone`,
    [userId, email, firstName || '', lastName || '', phone || '']
  );
}
