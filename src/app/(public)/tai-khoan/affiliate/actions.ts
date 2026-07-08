'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';
import { createNotification } from '@/lib/notifications';
import { sendAffiliateWelcome } from '@/lib/email';

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'WK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerAffiliate() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await currentUser();
  if (!user) throw new Error('User not found');

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error('Email not found');

  await ensureDatabaseReady();

  // Upsert customer
  const customerRes = await db.query(
    `INSERT INTO customers (clerk_id, email, first_name, last_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (clerk_id) DO UPDATE 
     SET email = EXCLUDED.email
     RETURNING id`,
    [userId, email, user.firstName || '', user.lastName || '']
  );
  
  const customerId = customerRes.rows[0].id;

  // Check if already affiliate
  const existing = await db.query('SELECT id FROM affiliates WHERE customer_id = $1', [customerId]);
  if (existing.rows.length > 0) return;

  // Generate unique code
  let refCode = generateReferralCode();
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 5) {
    const check = await db.query('SELECT id FROM affiliates WHERE referral_code = $1', [refCode]);
    if (check.rows.length === 0) {
      isUnique = true;
    } else {
      refCode = generateReferralCode();
      attempts++;
    }
  }

  if (!isUnique) throw new Error('Could not generate unique referral code');

  const { rows: affRows } = await db.query(
    `INSERT INTO affiliates (customer_id, referral_code) VALUES ($1, $2) RETURNING id`,
    [customerId, refCode]
  );
  

  await createNotification({
    type: 'new_affiliate',
    title: 'Cộng tác viên mới',
    body: `Cộng tác viên mới đăng ký với mã ${refCode} (${email}).`,
    refId: affRows[0].id,
    refType: 'affiliate'
  });
  
  sendAffiliateWelcome(email, (user.firstName || '') + ' ' + (user.lastName || ''), refCode);
}

export async function requestPayout(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const bankName = formData.get('bank_name') as string;
  const bankAccount = formData.get('bank_account') as string;
  const accountName = formData.get('account_name') as string;
  const note = formData.get('note') as string;

  if (!bankName || !bankAccount || !accountName) {
    throw new Error('Vui lòng điền đầy đủ thông tin ngân hàng');
  }

  await ensureDatabaseReady();

  const affiliateRes = await db.query(
    `SELECT a.id, a.balance FROM affiliates a
     JOIN customers c ON a.customer_id = c.id
     WHERE c.clerk_id = $1`,
    [userId]
  );

  const affiliate = affiliateRes.rows[0];
  if (!affiliate) throw new Error('Affiliate not found');
  
  if (Number(affiliate.balance) <= 0) {
    throw new Error('Số dư không đủ để rút tiền');
  }

  // Insert payout request
  await db.query(
    `INSERT INTO payout_requests (affiliate_id, amount, bank_name, bank_account, account_name, note)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [affiliate.id, affiliate.balance, bankName, bankAccount, accountName, note || '']
  );


  await createNotification({
    type: 'payout_request',
    title: 'Yêu cầu rút tiền',
    body: `Cộng tác viên #${affiliate.id} yêu cầu rút ${Number(affiliate.balance).toLocaleString('vi-VN')} đ.`,
    refId: affiliate.id,
    refType: 'affiliate'
  });
}
