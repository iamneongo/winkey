"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const featuredCategories = [
  { 
    name: "Phần mềm bản quyền", 
    count: "2.350+", 
    icon: "/products/windows-11-pro.svg",
    bg: "bg-blue-50"
  },
  { 
    name: "Âm nhạc bản quyền", 
    count: "15.000+", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/23/Apple_Music_logo.svg", // Mock icon
    bg: "bg-pink-50"
  },
  { 
    name: "Video & Stock Media", 
    count: "8.500+", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", // Mock icon
    bg: "bg-purple-50"
  },
  { 
    name: "AI Tools", 
    count: "1.200+", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", // Mock icon
    bg: "bg-emerald-50"
  },
  { 
    name: "Digital Marketing", 
    count: "2.000+", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Google_Ads_logo.svg", // Mock icon
    bg: "bg-orange-50"
  },
  { 
    name: "Website & Hosting", 
    count: "1.500+", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", // Mock icon
    bg: "bg-sky-50"
  }
];

export function FeaturedCategories() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Danh mục nổi bật</h2>
        <Link href="/cua-hang" className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {featuredCategories.map((cat, idx) => (
          <Link key={idx} href="/cua-hang" className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-blue-200 hover:shadow-md transition-all group">
            <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
               {/* Using an img tag with placeholder icons for now */}
               {cat.icon.startsWith('http') || cat.icon.startsWith('/') ? (
                  <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
               ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
               )}
            </div>
            <h3 className="text-[13px] font-bold text-gray-900 leading-tight mb-1">{cat.name}</h3>
            <p className="text-[11px] text-gray-500 font-medium">{cat.count} sản phẩm</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
