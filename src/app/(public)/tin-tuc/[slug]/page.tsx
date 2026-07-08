import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/catalog";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import styles from "../../../components/components.module.css";
import { ChevronLeft, CalendarDays } from "lucide-react";

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

  return (
    <>
      <Navbar />
      
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
        </div>
      </main>

      <Footer />
    </>
  );
}
