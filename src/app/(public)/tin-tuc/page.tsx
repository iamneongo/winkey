import React from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/catalog";
import styles from "../../components/components.module.css";
import { ArrowRight, CalendarDays } from "lucide-react";

export const metadata = {
  title: "Tin tức & Cập nhật | WinKey.vn",
  description: "Cập nhật các tin tức mới nhất về bản quyền phần mềm, Windows, Office từ WinKey.vn."
};

function formatDate(value: Date | string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export default async function NewsPage() {
  const { blogs } = await getBlogs({ publishedOnly: true, limit: 20 });

  return (
    <main className="min-h-screen bg-[var(--color-cloud-white)] pt-24 pb-20">
      <div className={styles.container}>
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-midnight-ink)" }} className="mb-4">
            Tin tức & Cập nhật
          </h1>
          <p className="text-lg text-[var(--color-slate-gray)]">
            Những thông tin mới nhất về bản quyền phần mềm, mẹo sử dụng Windows và Office từ đội ngũ WinKey.vn.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-lg text-[var(--color-slate-gray)]">Hiện tại chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <Link
                href={`/tin-tuc/${blog.slug}`}
                key={blog.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  {blog.cover_url ? (
                    <img
                      src={blog.cover_url}
                      alt={blog.title}
                      loading="lazy"
                      decoding="async"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center text-sm text-[var(--color-slate-gray)] mb-3">
                    <CalendarDays size={14} className="mr-2 shrink-0" />
                    {formatDate(blog.created_at)}
                  </div>
                  <h2 className="text-base font-bold leading-snug text-[var(--color-midnight-ink)] mb-3 line-clamp-2 group-hover:text-[var(--color-signal-blue)] transition-colors">
                    {blog.title}
                  </h2>
                  <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-[var(--color-signal-blue)]">
                    Đọc tiếp <ArrowRight size={16} className="ml-1 shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
