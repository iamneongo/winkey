'use client';

import { useState } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useMutation } from '@tanstack/react-query';
import { createUserMutation, updateUserMutation } from '../api/mutations';
import type { User } from '../api/types';
import { toast } from 'sonner';
import * as z from 'zod';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS } from './users-table/options';

const STATUS_OPTIONS = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động' },
  { value: 'Tạm khóa', label: 'Tạm khóa' },
  { value: 'Đã mời', label: 'Đã mời' }
];

interface UserFormSheetProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({ user, open, onOpenChange }: UserFormSheetProps) {
  const isEdit = !!user;

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success('Đã thêm thành viên mới.');
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error('Không thể thêm thành viên.')
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      toast.success('Đã cập nhật thông tin thành viên.');
      onOpenChange(false);
    },
    onError: () => toast.error('Không thể cập nhật thành viên.')
  });

  const form = useAppForm({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: user?.role ?? '',
      status: user?.status ?? 'Đang hoạt động'
    } as UserFormValues,
    validators: {
      onSubmit: userSchema
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: user.id, values: value });
      } else {
        await createMutation.mutateAsync(value);
      }
    }
  });

  const { FormTextField, FormSelectField } = useFormFields<UserFormValues>();

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Cập nhật thành viên' : 'Thêm thành viên'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Chỉnh lại thông tin cần hiển thị trong hệ thống quản trị.'
              : 'Điền thông tin cơ bản để tạo tài khoản quản trị mới.'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-auto'>
          <form.AppForm>
            <form.Form id='user-form-sheet' className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormTextField
                  name='first_name'
                  label='Tên'
                  required
                  placeholder='Minh'
                  validators={{
                    onBlur: z.string().min(2, 'Tên cần ít nhất 2 ký tự.')
                  }}
                />
                <FormTextField
                  name='last_name'
                  label='Họ'
                  required
                  placeholder='Anh'
                  validators={{
                    onBlur: z.string().min(2, 'Họ cần ít nhất 2 ký tự.')
                  }}
                />
              </div>

              <FormTextField
                name='email'
                label='Email'
                required
                type='email'
                placeholder='tenban@winkey.vn'
                validators={{
                  onBlur: z.string().email('Email chưa đúng định dạng.')
                }}
              />

              <FormTextField
                name='phone'
                label='Số điện thoại'
                required
                type='tel'
                placeholder='0901 234 567'
                validators={{
                  onBlur: z.string().min(1, 'Hãy nhập số điện thoại.')
                }}
              />

              <FormSelectField
                name='role'
                label='Vai trò'
                required
                options={ROLE_OPTIONS}
                placeholder='Chọn vai trò'
                validators={{
                  onBlur: z.string().min(1, 'Hãy chọn vai trò.')
                }}
              />

              <FormSelectField
                name='status'
                label='Trạng thái'
                required
                options={STATUS_OPTIONS}
                placeholder='Chọn trạng thái'
                validators={{
                  onBlur: z.string().min(1, 'Hãy chọn trạng thái.')
                }}
              />
            </form.Form>
          </form.AppForm>
        </div>

        <SheetFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type='submit' form='user-form-sheet' isLoading={isPending}>
            <Icons.check /> {isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' /> Thêm thành viên
      </Button>
      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
