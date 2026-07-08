'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { requestPayout } from './actions';
import { Textarea } from '@/components/ui/textarea';

export function PayoutForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await requestPayout(formData);
        toast.success('Yêu cầu đã gửi, admin sẽ xử lý trong 1–3 ngày làm việc.');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Lỗi gửi yêu cầu';
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên ngân hàng *</label>
        <Input name="bank_name" placeholder="VD: Vietcombank" required disabled={isPending} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Số tài khoản *</label>
        <Input name="bank_account" placeholder="VD: 0123456789" required disabled={isPending} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tên chủ tài khoản *</label>
        <Input name="account_name" placeholder="VD: NGUYEN VAN A" required disabled={isPending} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú thêm</label>
        <Textarea name="note" placeholder="Tùy chọn" disabled={isPending} />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Đang gửi...' : 'Gửi yêu cầu rút tiền'}
      </Button>
    </form>
  );
}
