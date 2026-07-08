'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';

export function InviteMemberDialog() {
  const { organization, isLoaded } = useOrganization();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('org:member');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!isLoaded || !organization) {
    return null;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    try {
      setIsLoading(true);
      await organization.inviteMember({ emailAddress: email, role });
      toast.success(`Đã gửi lời mời tới ${email}`);
      setIsOpen(false);
      setEmail('');
      router.refresh();
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      toast.error(e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message || 'Có lỗi xảy ra khi gửi lời mời');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className='mr-2 h-4 w-4' />
          Mời thành viên
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mời thành viên vào tổ chức</DialogTitle>
          <DialogDescription>
            Gửi email lời mời tham gia tổ chức <strong>{organization.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleInvite} className='space-y-4 py-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Địa chỉ Email</label>
            <Input 
              type='email' 
              placeholder='nguyenvana@example.com' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Vai trò (Role)</label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder='Chọn vai trò' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='org:member'>Thành viên (Member)</SelectItem>
                <SelectItem value='org:admin'>Quản trị viên (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={() => setIsOpen(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Đang gửi...
                </>
              ) : (
                'Gửi lời mời'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
