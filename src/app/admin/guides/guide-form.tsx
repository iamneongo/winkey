'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/rich-text-editor').then(mod => mod.RichTextEditor), { ssr: false });

type GuideFormProps = {
  initialData?: {
    id: number;
    title: string;
    content: string;
    category: string;
    is_published: boolean;
    sort_order: number;
  };
};

export function GuideForm({ initialData }: GuideFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || 'windows',
    is_published: initialData?.is_published || false,
    sort_order: initialData?.sort_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = initialData ? `/api/admin/guides/${initialData.id}` : '/api/admin/guides';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Không thể lưu hướng dẫn');
      
      toast.success(initialData ? 'Đã cập nhật' : 'Đã tạo bài hướng dẫn mới');
      router.push('/admin/guides');
      router.refresh();
    } catch (error) {
      toast.error('Lỗi khi lưu bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label>Tiêu đề *</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nhập tiêu đề bài hướng dẫn"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Nội dung *</Label>
            <RichTextEditor 
              value={formData.content}
              onChange={(val) => setFormData({...formData, content: val})}
            />
          </div>
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-100 h-fit">
          <div className="space-y-2">
            <Label>Chuyên mục</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({...formData, category: val})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="general">Chung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vị trí sắp xếp (Sort Order)</Label>
            <Input 
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước.</p>
          </div>

          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="publish-switch">Xuất bản</Label>
            <Switch 
              id="publish-switch"
              checked={formData.is_published}
              onCheckedChange={(val) => setFormData({...formData, is_published: val})}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </div>
    </form>
  );
}
