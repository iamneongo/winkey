"use client";

import React from "react";
import Image from "next/image";

export function MarketplaceHero() {
  return (
    <div className="mb-8 rounded-3xl overflow-hidden border border-blue-100 shadow-sm relative group bg-blue-50/50">
      <Image
        src="/images/hero-banner-windows.png"
        alt="Windows Key Chính Hãng - Kích hoạt nhanh, Bản quyền số, Hỗ trợ 24/7"
        width={1920}
        height={800}
        className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-700"
        priority
      />
    </div>
  );
}
