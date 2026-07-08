'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateProfile } from './actions';

export function ProfileForm({
  initialFirstName,
  initialLastName,
  initialPhone,
  email
}: {
  initialFirstName: string;
  initialLastName: string;
  initialPhone: string;
  email: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast.success('Cập nhật hồ sơ thành công');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Lỗi cập nhật hồ sơ';
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" value={email} disabled className="bg-gray-100" />
        <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ</label>
          <Input name="last_name" defaultValue={initialLastName} disabled={isPending} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <Input name="first_name" defaultValue={initialFirstName} disabled={isPending} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input name="phone" defaultValue={initialPhone} disabled={isPending} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </form>
  );
}
