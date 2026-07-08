import { db } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

type NotificationType = 'new_order' | 'order_paid' | 'order_failed' | 'new_affiliate' | 'low_key_stock' | 'payout_request';

export async function createNotification(data: {
  type: NotificationType;
  title: string;
  body?: string;
  refId?: number;
  refType?: 'order' | 'affiliate';
}) {
  await ensureDatabaseReady();
  await db.query(
    `INSERT INTO admin_notifications (type, title, body, ref_id, ref_type)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.type, data.title, data.body || null, data.refId || null, data.refType || null]
  );
}

export async function getUnreadCount(): Promise<number> {
  await ensureDatabaseReady();
  const { rows } = await db.query('SELECT COUNT(*) FROM admin_notifications WHERE is_read = FALSE');
  return parseInt(rows[0].count, 10);
}

export async function getNotifications(params: { limit: number; offset: number; unreadOnly: boolean }) {
  await ensureDatabaseReady();
  const { limit, offset, unreadOnly } = params;
  const whereClause = unreadOnly ? 'WHERE is_read = FALSE' : '';
  
  const { rows } = await db.query(
    `SELECT * FROM admin_notifications ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  
  const { rows: countRows } = await db.query(`SELECT COUNT(*) FROM admin_notifications ${whereClause}`);
  
  return {
    notifications: rows,
    total: parseInt(countRows[0].count, 10)
  };
}

export async function markAsRead(id: number) {
  await ensureDatabaseReady();
  await db.query('UPDATE admin_notifications SET is_read = TRUE WHERE id = $1', [id]);
}

export async function markAllAsRead() {
  await ensureDatabaseReady();
  await db.query('UPDATE admin_notifications SET is_read = TRUE WHERE is_read = FALSE');
}
