'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import type { Product } from '../../context/CartContext';
import styles from '../../components/components.module.css';

const categories = [
  { id: 'all', name: 'Tất cả sản phẩm' },
  { id: 'windows', name: 'Windows' },
  { id: 'office', name: 'Microsoft Office' },
  { id: 'combo', name: 'Combo ưu đãi' }
] as const;

export function StorePageClient({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.features.some((feature) => feature.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', background: '#fcfcfc', minHeight: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1400px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(20, 90, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className={styles.container} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.sectionHeader} style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-midnight-ink)' }}>
            Cửa hàng bản quyền
          </h1>
          <p style={{ maxWidth: '600px', margin: '12px auto 0 auto' }}>
            Chọn gói phù hợp, nhận key nhanh và quản lý đơn giản từ cùng một hệ thống admin.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px'
          }}
          className='store-controls-row'
        >
          <div style={{ display: 'flex', gap: '8px' }} className='store-tabs'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border:
                    selectedCategory === category.id
                      ? '1px solid var(--color-signal-blue)'
                      : '1px solid rgba(0, 0, 0, 0.06)',
                  background: selectedCategory === category.id ? 'var(--color-sky-wash)' : '#ffffff',
                  color:
                    selectedCategory === category.id
                      ? 'var(--color-signal-blue)'
                      : 'var(--color-ash)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }} className='store-search-box'>
            <input
              type='text'
              placeholder='Tìm sản phẩm...'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 38px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '100px',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-ash)'
              }}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <SlidersHorizontal size={40} style={{ color: 'var(--color-ash)', marginBottom: '16px' }} />
            <h4
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--color-midnight-ink)',
                margin: '0 0 4px 0'
              }}
            >
              Chưa có sản phẩm phù hợp
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ash)', margin: 0 }}>
              Thử đổi từ khóa hoặc chọn danh mục khác.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px'
            }}
            className='store-grid'
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 968px) {
          .store-controls-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .store-search-box {
            width: 100% !important;
          }
          .store-tabs {
            overflow-x: auto !important;
            padding-bottom: 4px !important;
            white-space: nowrap !important;
          }
          .store-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .store-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
