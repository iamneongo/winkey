"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Music,
  Video,
  LayoutTemplate,
  Bot,
  Megaphone,
  Globe,
  Link as LinkIcon,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";

const categories = [
  { icon: Package, label: "Phần mềm bản quyền", href: "#", active: true },
  { icon: Music, label: "Âm nhạc bản quyền", href: "#" },
  { icon: Video, label: "Video & Stock Media", href: "#" },
  { icon: LayoutTemplate, label: "Thiết kế & Template", href: "#" },
  { icon: Bot, label: "AI Tools", href: "#" },
  { icon: Megaphone, label: "Digital Marketing", href: "#" },
  { icon: Globe, label: "Website & Hosting", href: "#" },
  { icon: LinkIcon, label: "Tên miền", href: "#" },
  { icon: MoreHorizontal, label: "Dịch vụ khác", href: "#" },
];

export function MarketplaceSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 hidden xl:flex flex-col gap-6">
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
                <cat.icon className={`w-5 h-5 ${cat.active ? "text-blue-600" : "text-gray-400"}`} />
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
        <h4 className="text-blue-800 font-bold text-base mb-2 relative z-10">Trở thành đối tác</h4>
        <p className="text-sm text-blue-900/80 mb-5 relative z-10 font-medium leading-relaxed">
          Kinh doanh cùng WinKey AI. Hoa hồng hấp dẫn lên đến 30%
        </p>
        <button className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1 hover:bg-blue-700 transition-colors relative z-10">
          Đăng ký ngay <ArrowRight className="w-3 h-3" />
        </button>
        
        {/* Abstract shapes for illustration */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-60 z-0"></div>
        <div className="absolute right-2 bottom-2 z-0 opacity-90 transition-transform group-hover:scale-110">
          {/* Simple SVG illustration placeholder for the person with laptop */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#EBF5FF"/>
            <path d="M42 48H22C20.8954 48 20 47.1046 20 46V30C20 28.8954 20.8954 28 22 28H42C43.1046 28 44 28.8954 44 30V46C44 47.1046 43.1046 48 42 48Z" fill="#2563EB"/>
            <path d="M40 32H24V44H40V32Z" fill="#BFDBFE"/>
            <circle cx="32" cy="22" r="6" fill="#1D4ED8"/>
            <path d="M26 48L24 54H40L38 48H26Z" fill="#1E3A8A"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
