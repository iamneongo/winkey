import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlog, getBlogs } from "@/lib/catalog";
import styles from "../../../components/components.module.css";
import { ChevronLeft, CalendarDays, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.slug);
  if (!blog) {
    return { title: "Không tìm thấy bài viết" };
  }
  return {
    title: `${blog.title} | WinKey.vn`,
    description: "Tin tức bản quyền phần mềm, Windows, Office từ WinKey.vn."
  };
}

function formatDate(value: Date | string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.slug);

  if (!blog || !blog.is_published) {
    notFound();
  }

  const { blogs: allBlogs } = await getBlogs({ publishedOnly: true, limit: 4 });
  const relatedBlogs = allBlogs.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--color-cloud-white)] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link 
          href="/tin-tuc" 
          className="inline-flex items-center text-[var(--color-signal-blue)] font-medium mb-8 hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Trở lại danh sách tin tức
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {blog.cover_url && (
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 shadow-sm border border-gray-100">
              <img 
                src={blog.cover_url} 
                alt={blog.title} 
                className="object-cover w-full h-full" 
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex items-center text-sm font-medium text-[var(--color-slate-gray)] mb-6">
              <CalendarDays size={16} className="mr-2" />
              {formatDate(blog.created_at)}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-midnight-ink)] mb-10 leading-tight">
              {blog.title}
            </h1>

            {/* Dùng typography prose của Tailwind để hiển thị nội dung HTML đẹp mắt */}
            <div 
              className="prose prose-base md:prose-lg max-w-none text-[var(--color-slate-gray)]
                prose-headings:text-[var(--color-midnight-ink)] 
                prose-a:text-[var(--color-signal-blue)] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-midnight-ink)] mb-8">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link 
                  href={`/tin-tuc/${related.slug}`} 
                  key={related.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    {related.cover_url ? (
                      <img 
                        src={related.cover_url} 
                        alt={related.title} 
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-[var(--color-slate-gray)] mb-2">
                      <CalendarDays size={12} className="mr-1.5" />
                      {formatDate(related.created_at)}
                    </div>
                    <h3 className="text-base font-bold leading-snug text-[var(--color-midnight-ink)] mb-2 line-clamp-3 group-hover:text-[var(--color-signal-blue)] transition-colors">
                      {related.title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center text-xs font-semibold text-[var(--color-signal-blue)]">
                      Đọc tiếp <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
