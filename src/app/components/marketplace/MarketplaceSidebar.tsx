import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { marketplaceCategories } from "@/lib/marketplace-categories";

export function MarketplaceSidebar({ activeCategory = null }: { activeCategory?: string | null }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden xl:flex flex-col gap-6 sticky top-24 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Danh Mục</h3>
        <ul className="space-y-1">
          {marketplaceCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <li key={cat.id}>
                <Link
                  href={`/cua-hang?category=${cat.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <img
                    src={cat.img}
                    alt=""
                    aria-hidden="true"
                    className={`w-5 h-5 object-contain transition-all ${
                      isActive ? "" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                    }`}
                  />
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        href="/tai-khoan/affiliate"
        className="group relative block aspect-[4/3] shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-[#f3f8ff] shadow-sm transition-colors hover:border-blue-200"
      >
        <Image
          src="/images/affiliate-partner-bg.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="256px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
        />
        <div className="relative z-10 flex h-full flex-col p-5">
          <span className="max-w-[150px] text-lg font-extrabold leading-tight text-blue-700">
            Trở thành đối tác
          </span>
          <span className="mt-2 max-w-[145px] text-xs leading-5 text-slate-600">
            Chia sẻ WinKey, nhận hoa hồng hấp dẫn.
          </span>
          <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors group-hover:bg-blue-700">
            Tìm hiểu ngay
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </aside>
  );
}
