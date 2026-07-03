"use client";

import React, { useState } from "react";
import { X, Trash2, Minus, Plus, ShoppingBag, CreditCard, Sparkles, CheckCircle2, Copy, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./components.module.css";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<{ name: string; key: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Currency Formatter
  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  // Simulate Microsoft Key Generation
  const generateMockKey = (productId: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segment = () => Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate payment process
    setTimeout(() => {
      const keys = cart.map((item) => ({
        name: item.product.name,
        key: generateMockKey(item.product.id),
      }));
      setGeneratedKeys(keys);
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 2000);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Overlay Background */}
      <div
        className={`${styles.drawerOverlay} ${isCartOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slideout Panel */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h3>
            <ShoppingBag size={20} color="var(--primary-blue)" />
            <span>Giỏ Hàng Của Bạn</span>
          </h3>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={48} className={styles.emptyCartIcon} />
              <p>Giỏ hàng của bạn đang trống</p>
              <button className="btn-grad" style={{ padding: "10px 20px" }} onClick={() => setIsCartOpen(false)}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className={styles.cartItem}>
                <div className={styles.cartItemDetails}>
                  <div className={styles.cartItemName}>{item.product.name}</div>
                  <div className={styles.cartItemPrice}>{formatPrice(item.product.price)}</div>
                  <div className={styles.qtyActions}>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button className={styles.removeItem} onClick={() => removeFromCart(item.product.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.summaryRow}>
              <span>Tổng Cộng:</span>
              <span className={styles.totalVal}>{formatPrice(cartTotal)}</span>
            </div>
            <button className={`btn-grad ${styles.checkoutBtn}`} onClick={handleCheckout} disabled={isCheckingOut}>
              <CreditCard size={18} />
              <span>{isCheckingOut ? "Đang Xử Lý..." : "Thanh Toán Ngay (Mô Phỏng)"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Simulation Modal */}
      {checkoutSuccess && (
        <div className={styles.successOverlay}>
          <div className={`glass ${styles.successContent}`}>
            <CheckCircle2 size={64} className={styles.successIcon} />
            <h2>Thanh Toán Thành Công!</h2>
            <p>Bản quyền chính hãng đã được kích hoạt. Dưới đây là mã sản phẩm của bạn:</p>

            {generatedKeys.map((item, idx) => (
              <div key={idx} className={styles.licenseCodeContainer}>
                <p style={{ fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "6px" }}>{item.name}</p>
                <div className={styles.licenseCode}>{item.key}</div>
                <button className={styles.copySuccessBtn} onClick={() => copyToClipboard(item.key, idx)}>
                  {copiedIndex === idx ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Check size={14} /> Đã Sao Chép
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Copy size={14} /> Sao Chép Key
                    </span>
                  )}
                </button>
              </div>
            ))}

            <p style={{ fontSize: "0.8rem", color: "var(--muted-text)", marginTop: "10px" }}>
              * Hướng dẫn kích hoạt chi tiết đã được gửi đến hòm thư của bạn.
            </p>
            <button className="btn-grad" style={{ padding: "12px 30px", width: "100%" }} onClick={() => setCheckoutSuccess(false)}>
              Hoàn Thành
            </button>
          </div>
        </div>
      )}
    </>
  );
};
