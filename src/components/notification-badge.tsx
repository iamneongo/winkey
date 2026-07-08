'use client';

import { useEffect, useState } from 'react';

export function NotificationBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/notifications/unread-count');
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (error) {
        // ignore
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (count === null || count === 0) return null;

  return (
    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
