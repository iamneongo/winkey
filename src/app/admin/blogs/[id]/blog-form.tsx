'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/rich-text-editor';
import { toast } from 'sonner';
import { BlogRecord } from '@/lib/catalog';
import { Loader2 } from 'lucide-react';

interface BlogFormProps {
  initialData: BlogRecord | null;
}

type UploadResponse = {
  success?: boolean;
  message?: string;
  url?: string;
};

async function readUploadResponse(response: Response): Promise<UploadResponse> {
  const text = await response.text();
  try {
    return JSON.parse(text) as UploadResponse;
  } catch {
    return {
      success: false,
      message: response.ok
        ? 'Phản hồi upload không hợp lệ.'
        : `Upload thất bại (${response.status}).`
    };
  }
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const isNew = !initialData;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    cover_url: initialData?.cover_url || '',
    is_published: initialData?.is_published || false,
    content: initialData?.content || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from title if it's new and slug is not manually edited
      if (name === 'title' && isNew) {
        newData.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      return newData;
    });
  };

  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_published: checked }));
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setIsUploading(true);
    try {
      const response = await fetch('/api/uploads/blog-image', {
        method: 'POST',
        body: data,
      });
      const result = await readUploadResponse(response);
      
      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message || 'Upload thất bại');
      }

      const coverUrl = result.url;
      setFormData((prev) => ({ ...prev, cover_url: coverUrl }));
      toast.success('Đã tải ảnh lên thành công');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsUploading(false);
      input.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.title.length < 2) {
      toast.error('Tiêu đề cần ít nhất 2 ký tự');
      return;
    }
    
    if (formData.content.length < 10) {
      toast.error('Nội dung quá ngắn');
      return;
    }

    setIsLoading(true);

    try {
      const url = isNew ? '/api/blogs' : `/api/blogs/${initialData.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi lưu bài viết');
      }

      toast.success(isNew ? 'Đã tạo bài viết thành công' : 'Đã cập nhật bài viết thành công');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi hệ thống');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề bài viết"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Đường dẫn (Slug)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="duong-dan-bai-viet"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_url_file">Ảnh cover</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="cover_url_file"
                type="file"
                accept="image/*"
                onChange={handleUploadCover}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <p className="text-muted-foreground self-center text-sm">
                Chọn ảnh từ máy, tối đa 5MB.
              </p>
            </div>
            {formData.cover_url && (
              <div className="mt-2 border rounded-md overflow-hidden relative h-40 w-full sm:w-80 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.cover_url} alt="Cover preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_published">Xuất bản bài viết</Label>
          </div>

          <div className="space-y-2">
            <Label>Nội dung</Label>
            <RichTextEditor
              value={formData.content}
              onChange={handleEditorChange}
              placeholder="Viết nội dung của bạn ở đây..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/blogs')} disabled={isLoading || isUploading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Lưu bài viết' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  );
}
