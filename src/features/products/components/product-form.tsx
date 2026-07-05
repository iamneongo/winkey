'use client';

import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { createProductMutation, updateProductMutation } from '../api/mutations';
import type { Product } from '../api/types';
import { categoryOptions } from '@/features/products/constants/product-options';
import { productSchema, type ProductFormValues } from '@/features/products/schemas/product';

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createProductMutation,
    onSuccess: () => {
      toast.success('Đã tạo sản phẩm mới.');
      router.push('/admin/product');
    },
    onError: () => {
      toast.error('Không thể tạo sản phẩm.');
    }
  });

  const updateMutation = useMutation({
    ...updateProductMutation,
    onSuccess: () => {
      toast.success('Đã cập nhật sản phẩm.');
      router.push('/admin/product');
    },
    onError: () => {
      toast.error('Không thể cập nhật sản phẩm.');
    }
  });

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name ?? '',
      category: initialData?.category ?? '',
      price: initialData?.price,
      description: initialData?.description ?? ''
    } as ProductFormValues,
    validators: {
      onSubmit: productSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        category: value.category,
        price: value.price!,
        description: value.description
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormTextareaField } = useFormFields<ProductFormValues>();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormTextField
                name='name'
                label='Tên sản phẩm'
                required
                placeholder='Ví dụ: Windows 11 Professional Retail'
                validators={{
                  onBlur: z.string().min(2, 'Tên sản phẩm cần ít nhất 2 ký tự.')
                }}
              />

              <FormSelectField
                name='category'
                label='Danh mục'
                required
                options={categoryOptions}
                placeholder='Chọn danh mục'
                validators={{
                  onBlur: z.string().min(1, 'Hãy chọn danh mục.')
                }}
              />

              <FormTextField
                name='price'
                label='Giá bán'
                required
                type='number'
                min={0}
                step={0.01}
                placeholder='249000'
                validators={{
                  onBlur: z.number({ message: 'Hãy nhập giá bán.' })
                }}
              />
            </div>

            <FormTextareaField
              name='description'
              label='Mô tả'
              required
              placeholder='Mô tả ngắn gọn về sản phẩm, đối tượng phù hợp và cách bàn giao key.'
              maxLength={500}
              rows={4}
              validators={{
                onBlur: z.string().min(10, 'Mô tả cần ít nhất 10 ký tự.')
              }}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Quay lại
              </Button>
              <form.SubmitButton>{isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
