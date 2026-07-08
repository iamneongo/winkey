'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { registerAffiliate } from './actions';

export function RegisterButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRegister = () => {
    startTransition(async () => {
      try {
        await registerAffiliate();
        toast.success('Đăng ký Cộng tác viên thành công!');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Đã có lỗi xảy ra';
        toast.error(msg);
      }
    });
  };

  return (
    <Button onClick={handleRegister} disabled={isPending} size="lg" className="px-8 font-semibold">
      {isPending ? 'Đang xử lý...' : 'Đăng ký làm Cộng tác viên ngay'}
    </Button>
  );
}
