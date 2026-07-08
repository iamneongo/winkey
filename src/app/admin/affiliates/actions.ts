'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

export async function updateCommissionRate(affiliateId: number, rate: number) {
  const { orgRole } = await auth();
  if (orgRole !== 'org:admin') throw new Error('Unauthorized');
  
  if (rate < 1 || rate > 50) {
    throw new Error('Commission rate must be between 1 and 50');
  }

  await ensureDatabaseReady();
  await db.query(
    'UPDATE affiliates SET commission_rate = $1 WHERE id = $2',
    [rate, affiliateId]
  );
}

export async function updateAffiliateStatus(affiliateId: number, status: string) {
  const { orgRole } = await auth();
  if (orgRole !== 'org:admin') throw new Error('Unauthorized');
  
  if (!['active', 'suspended'].includes(status)) {
    throw new Error('Invalid status');
  }

  await ensureDatabaseReady();
  await db.query(
    'UPDATE affiliates SET status = $1 WHERE id = $2',
    [status, affiliateId]
  );
}

export async function markCommissionsPaid(affiliateId: number) {
  const { orgRole } = await auth();
  if (orgRole !== 'org:admin') throw new Error('Unauthorized');

  await ensureDatabaseReady();
  
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(
      `UPDATE commissions SET status = 'paid' 
       WHERE affiliate_id = $1 AND status = 'approved'`,
      [affiliateId]
    );

    await client.query(
      `UPDATE affiliates SET balance = 0 WHERE id = $1`,
      [affiliateId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
