'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { toast } from 'sonner';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { categoryOptions } from '@/features/products/constants/product-options';
import { productSchema, type ProductFormValues } from '@/features/products/schemas/product';
import { createProductMutation, updateProductMutation } from '../api/mutations';
import type { Product } from '../api/types';

const MANAGED_UPLOAD_PREFIX = '/uploads/products/';

type UploadResponse = {
  success: boolean;
  message?: string;
  url?: string;
};

function isManagedUploadUrl(url?: string) {
  return Boolean(url?.startsWith(MANAGED_UPLOAD_PREFIX));
}

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialData);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isRemovingImage, setIsRemovingImage] = useState(false);

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
      description: initialData?.description ?? '',
      photo_url: initialData?.photo_url ?? ''
    } as ProductFormValues,
    validators: {
      onSubmit: productSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        category: value.category,
        price: value.price!,
        description: value.description,
        photo_url: value.photo_url
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData!.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormTextareaField } = useFormFields<ProductFormValues>();

  async function deleteManagedImage(url: string) {
    const response = await fetch('/api/uploads/product-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const result = (await response.json()) as UploadResponse;
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Xóa ảnh thất bại');
    }
  }

  async function uploadProductImage(files: File[]) {
    const file = files[0];
    if (!file) return;

    const previousUrl = form.state.values.photo_url?.trim();
    setUploadProgress({ [file.name]: 20 });

    const body = new FormData();
    body.append('file', file);

    const response = await fetch('/api/uploads/product-image', {
      method: 'POST',
      body
    });

    const result = (await response.json()) as UploadResponse;

    if (!response.ok || !result.success || !result.url) {
      throw new Error(result.message || 'Upload thất bại');
    }

    if (previousUrl && previousUrl !== result.url && isManagedUploadUrl(previousUrl)) {
      try {
        await deleteManagedImage(previousUrl);
      } catch (error) {
        console.warn('Could not remove previous image:', error);
      }
    }

    setUploadProgress({ [file.name]: 100 });
    form.setFieldValue('photo_url', result.url);
    toast.success('Đã cập nhật ảnh sản phẩm.');
  }

  async function handleRemoveCurrentImage() {
    const currentUrl = form.state.values.photo_url?.trim();
    if (!currentUrl) return;

    setIsRemovingImage(true);

    try {
      if (isManagedUploadUrl(currentUrl)) {
        await deleteManagedImage(currentUrl);
      }

      form.setFieldValue('photo_url', '');
      toast.success('Đã xóa ảnh hiện tại.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa ảnh hiện tại.');
    } finally {
      setIsRemovingImage(false);
    }
  }

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

              <FormTextField
                name='photo_url'
                label='Ảnh sản phẩm'
                placeholder='/products/windows-11-pro.svg hoặc URL ảnh'
              />
            </div>

            <form.AppField name='photo_url'>
              {(field) => (
                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Upload ảnh mới</p>
                    <p className='text-muted-foreground text-sm'>
                      Nếu ảnh hiện tại là ảnh đã upload từ admin, hệ thống sẽ tự xóa ảnh cũ khi bạn thay bằng ảnh mới.
                    </p>
                  </div>
                  <FileUploader
                    accept={{ 'image/*': [] }}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    progresses={uploadProgress}
                    onUpload={uploadProductImage}
                  />
                  {field.state.value ? (
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-sm font-medium'>Ảnh hiện tại</p>
                        <div className='flex gap-2'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
                              input?.click();
                            }}
                          >
                            Thay ảnh
                          </Button>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            isLoading={isRemovingImage}
                            onClick={handleRemoveCurrentImage}
                          >
                            Xóa ảnh
                          </Button>
                        </div>
                      </div>
                      <div className='relative h-48 w-full max-w-md overflow-hidden rounded-xl border bg-muted/30'>
                        <Image
                          src={field.state.value}
                          alt={form.state.values.name || 'Ảnh sản phẩm'}
                          fill
                          sizes='(max-width: 768px) 100vw, 420px'
                          className='object-cover'
                        />
                      </div>
                      <p className='text-muted-foreground text-xs break-all'>{field.state.value}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </form.AppField>

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
