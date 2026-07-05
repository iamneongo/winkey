import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      {
        title: 'Dashboard',
        url: '/admin/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Không gian làm việc',
        url: '/admin/workspaces',
        icon: 'workspace',
        isActive: false,
        items: []
      },
      {
        title: 'Nhóm',
        url: '/admin/workspaces/team',
        icon: 'teams',
        isActive: false,
        items: [],
        access: { requireOrg: true }
      },
      {
        title: 'Sản phẩm',
        url: '/admin/product',
        icon: 'product',
        shortcut: ['p', 'p'],
        isActive: false,
        items: []
      },
      {
        title: 'Thành viên',
        url: '/admin/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
        items: []
      },
      {
        title: 'Kanban',
        url: '/admin/kanban',
        icon: 'kanban',
        shortcut: ['k', 'k'],
        isActive: false,
        items: []
      },
      {
        title: 'Trao đổi',
        url: '/admin/chat',
        icon: 'chat',
        shortcut: ['c', 'c'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: 'Biểu mẫu',
    items: [
      {
        title: 'Forms',
        url: '#',
        icon: 'forms',
        isActive: true,
        items: [
          {
            title: 'Form cơ bản',
            url: '/admin/forms/basic',
            icon: 'forms',
            shortcut: ['f', 'f']
          },
          {
            title: 'Form nhiều bước',
            url: '/admin/forms/multi-step',
            icon: 'forms'
          },
          {
            title: 'Sheet và Dialog',
            url: '/admin/forms/sheet-form',
            icon: 'forms'
          },
          {
            title: 'Mẫu nâng cao',
            url: '/admin/forms/advanced',
            icon: 'forms'
          }
        ]
      },
      {
        title: 'React Query',
        url: '/admin/react-query',
        icon: 'code',
        isActive: false,
        items: []
      },
      {
        title: 'Biểu tượng',
        url: '/admin/elements/icons',
        icon: 'palette',
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: 'Tài khoản',
    items: [
      {
        title: 'Gói Pro',
        url: '#',
        icon: 'pro',
        isActive: true,
        items: [
          {
            title: 'Nội dung riêng',
            url: '/admin/exclusive',
            icon: 'exclusive',
            shortcut: ['e', 'e']
          }
        ]
      },
      {
        title: 'Tài khoản',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            title: 'Hồ sơ',
            url: '/admin/profile',
            icon: 'profile',
            shortcut: ['m', 'm']
          },
          {
            title: 'Thông báo',
            url: '/admin/notifications',
            icon: 'notification',
            shortcut: ['n', 'n']
          },
          {
            title: 'Thanh toán',
            url: '/admin/billing',
            icon: 'billing',
            shortcut: ['b', 'b'],
            access: { requireOrg: true }
          },
          {
            title: 'Đăng xuất',
            shortcut: ['l', 'l'],
            url: '/',
            icon: 'login'
          }
        ]
      }
    ]
  }
];
