'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/tai-khoan', label: 'Tổng quan', exact: true },
  { href: '/tai-khoan/don-hang', label: 'Đơn hàng của tôi' },
  { href: '/tai-khoan/affiliate', label: 'Cộng tác viên (Affiliate)' }
];

export function AccountNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Điều hướng tài khoản"
      className="-mx-1 flex flex-row gap-2 overflow-x-auto px-1 pb-1 xl:flex-col xl:overflow-visible xl:pb-0"
    >
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors xl:shrink ${
              active
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
