"use client";

import React, { useState } from "react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";
import styles from "./components.module.css";

export const ProductList: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "windows" | "office" | "combo">("all");

  const filteredProducts = PRODUCTS.filter((product) => {
    if (filter === "all") return true;
    return product.category === filter;
  });

  return (
    <section id="store" className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Bảng Giá Key Bản Quyền</h2>
          <p>Chọn sản phẩm phù hợp với nhu cầu của bạn. Tất cả bản quyền đều được cam kết chính hãng và hỗ trợ kích hoạt online trọn đời.</p>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất Cả
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "windows" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("windows")}
          >
            Windows
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "office" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("office")}
          >
            Microsoft Office
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "combo" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("combo")}
          >
            Combo Khuyến Mại
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
