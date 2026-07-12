"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "../../context/CartContext";
import { ProductCard } from "../ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("Bán chạy");
  const tabs = ["Bán chạy", "Mới nhất", "Được đánh giá cao"];

  const visibleProducts = useMemo(() => {
    const list = [...products];
    if (activeTab === "Bán chạy") {
      // Most purchased ≈ most reviewed
      list.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
    } else if (activeTab === "Được đánh giá cao") {
      list.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)
      );
    }
    // "Mới nhất": keep API order (products come sorted by updated_at DESC)
    return list.slice(0, 4);
  }, [products, activeTab]);

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

      {/* 4 columns only on wide desktop (2xl); at lg/xl the side panels squeeze the middle column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </div>
    </div>
  );
}
