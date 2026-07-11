'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { EmptyProductsState } from '../../components/marketplace/EmptyProductsState';
import type { Product } from '../../context/CartContext';

export function StorePageClient({
  products,
  categoryLabel
}: {
  products: Product[];
  categoryLabel: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.features.some((feature) => feature.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const title = categoryLabel ?? 'Tất cả sản phẩm';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} sản phẩm</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Tìm sản phẩm..."
            aria-label="Tìm sản phẩm"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyProductsState
          title="Chưa có sản phẩm phù hợp"
          description="Thử đổi từ khóa tìm kiếm khác."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[1400px]:grid-cols-3 min-[1600px]:grid-cols-4 gap-4 xl:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
