import PageContainer from '@/components/layout/page-container';
import { GuideForm } from '../guide-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getGuideById } from '@/lib/catalog';
import { notFound } from 'next/navigation';

export default async function EditGuidePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const guide = await getGuideById(parseInt(id, 10));

  if (!guide) notFound();

  return (
    <PageContainer 
      pageTitle="Chỉnh sửa hướng dẫn" 
      pageDescription={`Cập nhật bài viết: ${guide.title}`}
    >
      <div className="mb-4">
        <Link href="/admin/guides" className="text-sm text-blue-600 flex items-center hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
      </div>

      <GuideForm initialData={guide} />
    </PageContainer>
  );
}
