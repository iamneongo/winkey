"use client";

import React from "react";
import { ShieldCheck, LockKeyhole, Zap, Headset, ShoppingCart, Music } from "lucide-react";
import Image from "next/image";

export function MarketplaceHero() {
  return (
    <div className="bg-gradient-to-r from-blue-50/80 via-blue-100/50 to-blue-50/80 rounded-3xl p-8 lg:p-10 border border-blue-100/50 relative overflow-hidden mb-8">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/40 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-40 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            Nền tảng số 1 Việt Nam về
          </h2>
          <h1 className="text-3xl lg:text-4xl font-black text-blue-600 mb-4 leading-[1.2] tracking-tight">
            Bản quyền số & <br className="hidden lg:block" />Digital Marketing
          </h1>
          <p className="text-[15px] text-gray-700 font-medium mb-8 max-w-md leading-relaxed">
            Mua bán, cấp phép và khai thác tài sản số<br />
            dễ dàng - an toàn - minh bạch
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors shadow-sm text-sm">
              Khám phá ngay
            </button>
            <button className="bg-white text-blue-600 border border-blue-200 font-bold py-3 px-6 rounded-full hover:bg-blue-50 transition-colors text-sm shadow-sm">
              Đăng bán tài sản
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-blue-200/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">100% bản quyền</p>
                <p className="text-[9px] text-gray-500 font-medium">Đảm bảo chính hãng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LockKeyhole className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">Thanh toán an toàn</p>
                <p className="text-[9px] text-gray-500 font-medium">Đa dạng phương thức</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">Giao dịch tự động</p>
                <p className="text-[9px] text-gray-500 font-medium">Nhanh chóng - tiện lợi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Headset className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">Hỗ trợ 24/7</p>
                <p className="text-[9px] text-gray-500 font-medium">Tận tâm - chuyên nghiệp</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Illustration Placeholder */}
        <div className="relative w-full max-w-[320px] aspect-square hidden md:flex items-center justify-center perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-2xl"></div>
          
          {/* Real Generated 3D Illustration */}
          <div className="relative z-10 w-[120%] h-[120%] ml-8 animate-float">
             <Image
                src="/images/hero-illustration.png"
                alt="Digital Marketplace Assets"
                fill
                className="object-contain drop-shadow-2xl"
                priority
             />
          </div>
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        <div className="w-2 h-2 rounded-full bg-blue-200"></div>
        <div className="w-2 h-2 rounded-full bg-blue-200"></div>
      </div>
    </div>
  );
}
