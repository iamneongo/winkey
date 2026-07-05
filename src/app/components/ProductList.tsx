'use client';

import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../context/CartContext';
import styles from './components.module.css';

export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const [filter, setFilter] = useState<'all' | 'windows' | 'office' | 'combo'>('all');

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  return (
    <section id='store' className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Bảng giá key bản quyền</h2>
          <p>
            Chọn sản phẩm phù hợp với nhu cầu của bạn. Tất cả key đều được đồng bộ từ hệ thống quản
            trị và có hỗ trợ kích hoạt rõ ràng.
          </p>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'windows' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('windows')}
          >
            Windows
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'office' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('office')}
          >
            Microsoft Office
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'combo' ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter('combo')}
          >
            Combo ưu đãi
          </button>
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
