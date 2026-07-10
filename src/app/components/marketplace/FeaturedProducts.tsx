"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import { Product, useCart } from "../../context/CartContext";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("Bán chạy");
  const tabs = ["Bán chạy", "Mới nhất", "Được đánh giá cao"];
  const { addToCart } = useCart();

  const formatPrice = (num: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(num);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold text-gray-900">Sản phẩm nổi bật</h2>
          <div className="hidden md:flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[13px] font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <Link href="/cua-hang" className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
         {tabs.map((tab) => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`text-[13px] font-bold whitespace-nowrap px-4 py-1.5 rounded-full transition-colors ${
               activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all group flex flex-col">
            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
               <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
               />
               {product.tag && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">
                     {product.tag}
                  </div>
               )}
            </div>
            <div className="p-4 flex flex-col flex-1">
               <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                  {product.name}
               </h3>
               <p className="text-[11px] text-gray-500 font-medium mb-3 line-clamp-1">
                  {product.description || "Sản phẩm kỹ thuật số"}
               </p>
               <div className="mt-auto">
                  <div className="font-bold text-[15px] text-blue-600 mb-3">
                     {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                     <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-gray-700">{product.rating || "5.0"}</span>
                        <span className="text-[11px] text-gray-400">({product.reviews_count || Math.floor(Math.random() * 200) + 50})</span>
                     </div>
                     <button 
                        onClick={() => addToCart(product)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                     >
                        <ShoppingCart className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
