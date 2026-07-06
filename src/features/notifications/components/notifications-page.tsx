'use client';

import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { NotificationCard } from '@/components/ui/notification-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationStore } from '../utils/store';

const actionRoutes: Record<string, string> = {
  view: '/admin/overview',
  'view-product': '/admin/product',
  billing: '/admin/billing',
  open: '/admin/overview',
  'open-chat': '/ho-tro'
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const router = useRouter();
  const count = unreadCount();

  const unreadNotifications = notifications.filter((notification) => notification.status === 'unread');
  const readNotifications = notifications.filter((notification) => notification.status === 'read');

  const renderList = (items: typeof notifications) => {
    if (items.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-16'>
          <Icons.notification className='text-muted-foreground/40 mb-3 h-10 w-10' />
          <p className='text-muted-foreground text-sm'>Chưa có thông báo nào</p>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-2'>
        {items.map((notification) => (
          <NotificationCard
            key={notification.id}
            id={notification.id}
            title={notification.title}
            body={notification.body}
            status={notification.status}
            createdAt={notification.createdAt}
            actions={notification.actions}
            onMarkAsRead={markAsRead}
            onAction={(notificationId, actionId) => {
              const route = actionRoutes[actionId];
              if (route) {
                markAsRead(notificationId);
                router.push(route);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <PageContainer
      pageTitle='Thông báo'
      pageDescription='Các nhắc việc nội bộ, thay đổi catalog và tín hiệu vận hành gần đây của WinKey.'
      pageHeaderAction={
        count > 0 ? (
          <Button variant='outline' size='sm' onClick={markAllAsRead}>
            Đánh dấu đã đọc tất cả
          </Button>
        ) : undefined
      }
    >
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>Tất cả ({notifications.length})</TabsTrigger>
          <TabsTrigger value='unread'>Chưa đọc ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value='read'>Đã đọc ({readNotifications.length})</TabsTrigger>
        </TabsList>
        <TabsContent value='all' className='mt-4'>
          {renderList(notifications)}
        </TabsContent>
        <TabsContent value='unread' className='mt-4'>
          {renderList(unreadNotifications)}
        </TabsContent>
        <TabsContent value='read' className='mt-4'>
          {renderList(readNotifications)}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
