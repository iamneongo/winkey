import PageContainer from '@/components/layout/page-container';
import { getNotifications, markAllAsRead } from '@/lib/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, XCircle, UserPlus, AlertTriangle, Banknote, Bell } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { MarkAsReadButton } from './mark-read-button';

export const dynamic = 'force-dynamic';

function getIcon(type: string) {
  switch (type) {
    case 'new_order': return <ShoppingCart className="w-5 h-5 text-blue-500" />;
    case 'order_paid': return <CheckCircle className="w-5 h-5 text-blue-500" />;
    case 'order_failed': return <XCircle className="w-5 h-5 text-red-500" />;
    case 'order_cancelled': return <XCircle className="w-5 h-5 text-orange-500" />;
    case 'new_affiliate': return <UserPlus className="w-5 h-5 text-purple-500" />;
    case 'low_key_stock': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'payout_request': return <Banknote className="w-5 h-5 text-emerald-500" />;
    default: return <Bell className="w-5 h-5 text-gray-500" />;
  }
}

function getLink(type: string, refId?: number) {
  if (!refId) return '#';
  if (type.startsWith('order') || type === 'low_key_stock') return `/admin/orders/${refId}`;
  if (type === 'new_affiliate' || type === 'payout_request') return `/admin/affiliates/${refId}`;
  return '#';
}

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string | null;
  ref_id: number | null;
  is_read: boolean;
  created_at: string;
}

export default async function NotificationsPage(props: {
  searchParams: Promise<{ page?: string; unread?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const unreadOnly = searchParams.unread === 'true';
  const limit = 20;
  const offset = (page - 1) * limit;

  const { notifications, total } = await getNotifications({ limit, offset, unreadOnly });
  const totalPages = Math.ceil(total / limit);

  const markAllAction = async () => {
    'use server';
    await markAllAsRead();
    revalidatePath('/admin/notifications');
  };

  return (
    <PageContainer pageTitle="Thông báo hệ thống">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <Link 
            href="/admin/notifications" 
            className={`px-4 py-2 text-sm rounded-md transition-colors ${!unreadOnly ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tất cả
          </Link>
          <Link 
            href="/admin/notifications?unread=true" 
            className={`px-4 py-2 text-sm rounded-md transition-colors ${unreadOnly ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Chưa đọc
          </Link>
        </div>

        <form action={markAllAction}>
          <Button type="submit" variant="outline">
            Đánh dấu tất cả đã đọc
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có thông báo nào.
            </div>
          ) : (
            notifications.map((notif: Notification) => (
              <div key={notif.id} className={`p-4 flex items-start gap-4 transition-colors ${notif.is_read ? 'bg-white opacity-80' : 'bg-blue-50/50'}`}>
                <div className="mt-1 bg-white p-2 rounded-full border shadow-sm">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link href={getLink(notif.type, notif.ref_id || undefined)} className="font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                      {notif.title}
                    </Link>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(notif.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  {notif.body && (
                    <p className="text-sm text-gray-600 mt-1">{notif.body}</p>
                  )}
                  {!notif.is_read && (
                    <div className="mt-2">
                      <MarkAsReadButton id={notif.id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Trang {page} / {totalPages} (Tổng {total})
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild disabled={page <= 1}>
              <Link href={`/admin/notifications?page=${page - 1}${unreadOnly ? '&unread=true' : ''}`}>Trước</Link>
            </Button>
            <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
              <Link href={`/admin/notifications?page=${page + 1}${unreadOnly ? '&unread=true' : ''}`}>Sau</Link>
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
