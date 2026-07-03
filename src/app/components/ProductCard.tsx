"use client";

import React from "react";
import { Star, Check, ShoppingCart, ShieldCheck } from "lucide-react";
import { Product, useCart } from "../context/CartContext";
import styles from "./components.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const renderProductLogo = () => {
    let logoUrl = "";
    let altText = "";
    if (product.category === "windows") {
      logoUrl = "https://thesvg.org/icons/windows/default.svg";
      altText = "Windows Logo";
    } else if (product.category === "office") {
      logoUrl = "https://thesvg.org/icons/microsoft-office/default.svg";
      altText = "Microsoft Office Logo";
    } else {
      logoUrl = "https://thesvg.org/icons/microsoft/default.svg";
      altText = "Microsoft Logo";
    }
    return (
      <img src={logoUrl} alt={altText} width="24" height="24" style={{ objectFit: "contain" }} />
    );
  };

  return (
    <div className={`glass ${styles.prodCard}`} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Sleek Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {renderProductLogo()}
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {product.category === "windows" ? "Windows" : product.category === "office" ? "Office" : "Combo"}
          </span>
        </div>

        {/* Status Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(22, 202, 46, 0.1)",
            color: "var(--color-emerald-status)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "0.65rem",
            fontWeight: 700,
          }}
        >
          <span style={{ width: "6px", height: "6px", background: "currentColor", borderRadius: "50%" }}></span>
          <span>CÒN HÀNG</span>
        </div>
      </div>

      {/* Title & Reviews */}
      <div>
        <h3 className={styles.cardTitle} style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "6px" }}>{product.name}</h3>
        
        <div className={styles.rating} style={{ marginBottom: "0px" }}>
          <div className={styles.ratingStars} style={{ color: "#f59e0b" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
          </div>
          <span className={styles.ratingText} style={{ fontSize: "0.7rem", color: "var(--color-ash)" }}>
            {product.rating} ({product.reviewsCount} Đánh giá)
          </span>
        </div>
      </div>

      {/* Features List */}
      <ul className={styles.featureList} style={{ display: "flex", flexDirection: "column", gap: "8px", margin: 0, padding: 0 }}>
        {product.features.map((feature, idx) => (
          <li key={idx} className={styles.featureItem} style={{ display: "flex", alignItems: "center", gap: "8px", listStyle: "none" }}>
            <Check size={14} style={{ color: "var(--color-signal-blue)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8rem", color: "var(--color-ash)" }}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Pricing and Action Outline CTA */}
      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(0, 0, 0, 0.06)", paddingTop: "16px" }}>
        
        {/* Monospaced Roboto Mono Prices */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
          <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: "1.45rem", fontWeight: 700, color: "var(--color-signal-blue)", letterSpacing: "-0.5px" }}>
            {formatPrice(product.price)}
          </span>
          <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: "0.85rem", color: "var(--color-ash)", textDecoration: "line-through" }}>
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Filled Action Button */}
        <button
          className="btn-grad"
          onClick={() => addToCart(product)}
          style={{
            width: "100%",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "0.85rem",
            textTransform: "none",
            letterSpacing: "0px",
            fontWeight: 600
          }}
        >
          <ShoppingCart size={16} />
          <span>Thêm vào giỏ hàng</span>
        </button>
      </div>

    </div>
  );
};
