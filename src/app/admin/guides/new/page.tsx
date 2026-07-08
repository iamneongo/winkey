import PageContainer from '@/components/layout/page-container';
import { GuideForm } from '../guide-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewGuidePage() {
  return (
    <PageContainer 
      pageTitle="Thêm bài hướng dẫn mới" 
      pageDescription="Viết bài hướng dẫn chi tiết cho người dùng"
    >
      <div className="mb-4">
        <Link href="/admin/guides" className="text-sm text-blue-600 flex items-center hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
      </div>

      <GuideForm />
    </PageContainer>
  );
}
