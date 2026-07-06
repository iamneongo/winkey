import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'WinKey Admin',
    items: [
      {
        title: 'Tổng quan',
        url: '/admin/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Sản phẩm',
        url: '/admin/product',
        icon: 'product',
        isActive: false,
        shortcut: ['p', 'p'],
        items: []
      },
      {
        title: 'Thành viên',
        url: '/admin/users',
        icon: 'teams',
        isActive: false,
        shortcut: ['u', 'u'],
        items: []
      },
      {
        title: 'Thông báo',
        url: '/admin/notifications',
        icon: 'notification',
        isActive: false,
        shortcut: ['n', 'n'],
        items: []
      }
    ]
  },
  {
    label: 'Tài khoản',
    items: [
      {
        title: 'Hồ sơ',
        url: '/admin/profile',
        icon: 'profile',
        isActive: false,
        shortcut: ['m', 'm'],
        items: []
      },
      {
        title: 'Đăng xuất',
        url: '/',
        icon: 'login',
        isActive: false,
        shortcut: ['l', 'l'],
        items: []
      }
    ]
  }
];
