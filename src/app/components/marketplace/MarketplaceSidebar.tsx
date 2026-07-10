"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { img: "https://thesvg.org/icons/windows/default.svg", label: "Phần mềm bản quyền", href: "#", active: true },
  { img: "https://thesvg.org/icons/apple-music/default.svg", label: "Âm nhạc bản quyền", href: "#" },
  { img: "https://thesvg.org/icons/youtube/default.svg", label: "Video & Stock Media", href: "#" },
  { img: "https://thesvg.org/icons/figma/default.svg", label: "Thiết kế & Template", href: "#" },
  { img: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", label: "AI Tools", href: "#" },
  { img: "https://thesvg.org/icons/google-ads/default.svg", label: "Digital Marketing", href: "#" },
  { img: "https://thesvg.org/icons/github/default.svg", label: "Website & Hosting", href: "#" },
  { img: "https://thesvg.org/icons/cloudflare/default.svg", label: "Tên miền", href: "#" },
  { img: "https://thesvg.org/icons/slack/default.svg", label: "Dịch vụ khác", href: "#" },
];

export function MarketplaceSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 hidden xl:flex flex-col gap-6 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Danh Mục</h3>
        <ul className="space-y-1">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link
                href={cat.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  cat.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <img 
                  src={cat.img} 
                  alt={cat.label} 
                  className={`w-5 h-5 object-contain transition-all ${cat.active ? "" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"}`} 
                />
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link href="#" className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group mt-6">
        <img 
          src="/images/affiliate-banner-2.png" 
          alt="Trở thành đối tác kinh doanh cùng WinKey AI. Hoa hồng hấp dẫn lên đến 30%" 
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
    </aside>
  );
}
