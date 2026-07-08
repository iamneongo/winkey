import { getGuideBySlug, getPublicGuides } from '@/lib/catalog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Không tìm thấy hướng dẫn' };
  }

  return {
    title: `${guide.title} | WinKey Hướng dẫn`,
    description: guide.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
  };
}

export default async function GuideDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const guide = await getGuideBySlug(slug);

  if (!guide || !guide.is_published) {
    notFound();
  }

  const allGuides = await getPublicGuides();
  const relatedGuides = allGuides.filter((g: { id: number; category: string }) => g.category === guide.category && g.id !== guide.id).slice(0, 5);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-[120px] pb-[100px]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/huong-dan" className="hover:text-blue-600">Hướng dẫn</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">{guide.title}</span>
          </nav>

          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <header className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {guide.category === 'general' ? 'Chung' : guide.category}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(guide.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {guide.title}
              </h1>
            </header>

            <div 
              className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </article>
          
          <div className="mt-8">
            <Link href="/huong-dan" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại danh sách hướng dẫn
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
              Cùng chuyên mục
            </h3>
            
            {relatedGuides.length > 0 ? (
              <div className="space-y-4">
                {relatedGuides.map((rg: { id: number; title: string; slug: string }) => (
                  <Link 
                    key={rg.id} 
                    href={`/huong-dan/${rg.slug}`}
                    className="block group"
                  >
                    <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug mb-2">
                        {rg.title}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center">
                        Xem chi tiết <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có bài viết nào khác trong chuyên mục này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
