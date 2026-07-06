import { create } from 'zustand';
import type { NotificationStatus, NotificationAction } from '@/components/ui/notification-card';

export type Notification = {
  id: string;
  title: string;
  body: string;
  status: NotificationStatus;
  createdAt: string;
  actions?: NotificationAction[];
};

type NotificationState = {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'status'>) => void;
  unreadCount: () => number;
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Catalog đã đồng bộ ảnh sản phẩm',
    body: 'Ảnh sản phẩm mới đã được cập nhật trong khu quản trị và storefront.',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actions: [{ id: 'view-product', label: 'Mở sản phẩm', type: 'redirect', style: 'primary' }]
  },
  {
    id: '2',
    title: 'Có yêu cầu hỗ trợ mới',
    body: 'Một ticket hỗ trợ vừa được tạo từ biểu mẫu khách hàng.',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actions: [{ id: 'open-chat', label: 'Kiểm tra ngay', type: 'redirect', style: 'primary' }]
  },
  {
    id: '3',
    title: 'Route quản trị đã chuẩn hóa',
    body: 'Người dùng hiện truy cập khu quản trị qua đường dẫn /admin thay vì phụ thuộc vào rewrite cũ.',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actions: [{ id: 'view', label: 'Xem tổng quan', type: 'redirect', style: 'primary' }]
  }
];

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: initialNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, status: 'read' as const } : notification
      )
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        status: 'read' as const
      }))
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id)
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, status: 'unread' as const }, ...state.notifications]
    })),
  unreadCount: () => get().notifications.filter((notification) => notification.status === 'unread').length
}));
