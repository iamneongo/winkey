'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await currentUser();
  if (!user) throw new Error('User not found');

  const firstName = String(formData.get('first_name') ?? '').trim();
  const lastName = String(formData.get('last_name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error('Email not found');
  if (firstName.length > 100 || lastName.length > 100) {
    throw new Error('Họ và tên không được dài quá 100 ký tự');
  }
  if (phone.length > 30) {
    throw new Error('Số điện thoại không hợp lệ');
  }

  await ensureDatabaseReady();

  // The account layout syncs identity data from Clerk on every request. Keep
  // Clerk and the customer record aligned so a refresh cannot restore old names.
  const client = await clerkClient();
  await client.users.updateUser(userId, { firstName, lastName });

  // Upsert customer based on clerk_id
  await db.query(
    `INSERT INTO customers (clerk_id, email, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (clerk_id) DO UPDATE 
     SET first_name = EXCLUDED.first_name, 
         last_name = EXCLUDED.last_name, 
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         updated_at = NOW()`,
    [userId, email, firstName || '', lastName || '', phone || '']
  );

  revalidatePath('/tai-khoan');
}
