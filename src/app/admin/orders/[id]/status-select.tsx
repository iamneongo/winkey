'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface StatusSelectProps {
  orderId: number;
  currentStatus: string;
}

export function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Cập nhật trạng thái thất bại');
      }

      toast.success('Đã cập nhật trạng thái đơn hàng');
      
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      setStatus(currentStatus);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Chờ thanh toán</SelectItem>
        <SelectItem value="paid">Đã thanh toán</SelectItem>
        <SelectItem value="failed">Thất bại</SelectItem>
      </SelectContent>
    </Select>
  );
}
