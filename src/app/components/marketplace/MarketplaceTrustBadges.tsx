"use client";

import React from "react";
import { ShieldCheck, LockKeyhole, Zap, RotateCcw, Receipt } from "lucide-react";

export function MarketplaceTrustBadges() {
  return (
    <div className="mt-8 pt-8 border-t border-gray-100 hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">Thanh toán đa dạng</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-none">Hỗ trợ nhiều phương thức</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <LockKeyhole className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">Giao dịch an toàn</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-none">Bảo mật & minh bạch</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">Tải về nhanh chóng</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-none">Tốc độ cao, ổn định</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">Hoàn tiền dễ dàng</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-none">Chính sách rõ ràng</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
          <Receipt className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">Hóa đơn điện tử</h4>
          <p className="text-[10px] text-gray-500 font-medium leading-none">Xuất hóa đơn nhanh chóng</p>
        </div>
      </div>
    </div>
  );
}
