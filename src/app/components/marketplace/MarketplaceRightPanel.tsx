"use client";

import React from "react";
import {
  Hexagon,
  BadgeCheck,
  FileBadge2,
  Cpu,
  Clock,
  Send,
  User,
  Package,
  ShoppingBag,
  Star,
  Bot
} from "lucide-react";

export function MarketplaceRightPanel() {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:flex flex-col gap-6 sticky top-24 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6">

      {/* Tại sao chọn WinKey? */}
      <div className="shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-[15px] text-gray-900 mb-4">Tại sao chọn WinKey.vn?</h3>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
              <BadgeCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">Sản phẩm chính hãng 100%</h4>
              <p className="text-xs text-gray-500 font-medium leading-snug">Kích hoạt online, bảo hành vĩnh viễn</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Hexagon className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">Giá tốt nhất thị trường</h4>
              <p className="text-xs text-gray-500 font-medium leading-snug">Tiết kiệm chi phí lên đến 80%</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">Giao hàng tự động 24/7</h4>
              <p className="text-xs text-gray-500 font-medium leading-snug">Nhận key qua email chỉ sau 1 phút</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <FileBadge2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">Thanh toán linh hoạt</h4>
              <p className="text-xs text-gray-500 font-medium leading-snug">An toàn, bảo mật thông tin tuyệt đối</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">Hỗ trợ kỹ thuật trọn đời</h4>
              <p className="text-xs text-gray-500 font-medium leading-snug">Đội ngũ IT chuyên môn cao, tận tâm</p>
            </div>
          </li>
        </ul>
      </div>

      {/* AI Assistant */}
      <div className="shrink-0 bg-gradient-to-b from-blue-50/50 to-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-blue-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">CSKH WinKey</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Online</span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-3 mb-4 shadow-sm inline-block max-w-[90%]">
            <p className="text-xs text-gray-800 font-medium leading-relaxed">
              Xin chào! WinKey có thể hỗ trợ gì cho bạn hôm nay? 😊
            </p>
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            {["Tư vấn Windows/Office", "Hướng dẫn cài đặt", "Chính sách bảo hành", "Kiểm tra đơn hàng"].map((suggestion, i) => (
              <button key={i} className="text-left w-fit px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 before:content-['@'] before:opacity-50">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-white border-t border-gray-100 m-2 mt-0 rounded-xl relative flex items-center shadow-sm">
          <input 
            type="text" 
            placeholder="Nhập câu hỏi của bạn..." 
            className="w-full text-xs outline-none bg-transparent pr-10 text-gray-700 placeholder:text-gray-400 font-medium"
          />
          <button className="absolute right-2 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm">
            <Send className="w-3.5 h-3.5 ml-[-2px]" />
          </button>
        </div>
      </div>

      {/* Thống kê nền tảng */}
      <div className="shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-[15px] text-gray-900 mb-4">Thống kê nền tảng</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none mb-1">50.000+</div>
              <div className="text-xs text-gray-500 font-medium leading-none">Khách hàng</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none mb-1">500+</div>
              <div className="text-xs text-gray-500 font-medium leading-none">Sản phẩm phần mềm</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none mb-1">125.000+</div>
              <div className="text-xs text-gray-500 font-medium leading-none">Đơn hàng hoàn thành</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none mb-1">99.8%</div>
              <div className="text-xs text-gray-500 font-medium leading-none">Đánh giá 5 sao</div>
            </div>
          </li>
        </ul>
      </div>

    </aside>
  );
}
