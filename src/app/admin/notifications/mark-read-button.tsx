'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function MarkAsReadButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMarkAsRead = () => {
    startTransition(async () => {
      await fetch(`/api/admin/notifications/${id}`, { method: 'PATCH' });
      router.refresh();
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleMarkAsRead}
      disabled={isPending}
    >
      {isPending ? 'Đang đánh dấu...' : 'Đánh dấu đã đọc'}
    </Button>
  );
}
