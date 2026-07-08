import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { getBlog } from '@/lib/catalog';
import { BlogForm } from './blog-form';

export const metadata = {
  title: 'WinKey Admin | Chỉnh sửa bài viết'
};

export const dynamic = 'force-dynamic';

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin/blogs');
  }

  const isNew = resolvedParams.id === 'new';
  let blog = null;

  if (!isNew) {
    const id = parseInt(resolvedParams.id, 10);
    if (!isNaN(id)) {
      blog = await getBlog(id);
    }
  }

  return (
    <PageContainer
      pageTitle={isNew ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
      pageDescription={isNew ? 'Tạo một bài viết mới cho blog' : 'Cập nhật nội dung bài viết'}
    >
      <div className="w-full">
        <BlogForm initialData={blog} />
      </div>
    </PageContainer>
  );
}
