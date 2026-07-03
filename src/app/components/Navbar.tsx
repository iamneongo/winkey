"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./components.module.css";

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Backdrop overlay for Left drawer menu */}
      <div
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOverlayOpen : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navbarInner}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 23"
              width="18"
              height="18"
              style={{ marginRight: "8px", fill: "var(--color-signal-blue)" }}
            >
              <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
            </svg>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.5px" }}>WinKey.vn</span>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navLinks}>
            <a href="/cua-hang" className={styles.navLink}>
              Cửa Hàng
            </a>
            <a href="/huong-dan" className={styles.navLink}>
              Hướng Dẫn
            </a>
            <a href="/#faq" className={styles.navLink}>
              Hỏi Đáp
            </a>
            <a href="/ho-tro" className={styles.navLink}>
              Hỗ Trợ
            </a>
          </nav>

          {/* Actions & Hamburger Toggle */}
          <div className={styles.navActions}>
            <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)} aria-label="Xem giỏ hàng">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>
            
            <a href="#store" className="btn-grad" style={{ padding: "8px 18px", fontSize: "0.85rem", textTransform: "none", borderRadius: "100px" }}>
              Mua Ngay
            </a>

            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel: Left-to-Right Drawer */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        
        {/* Drawer Header with Close Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
          <div className={styles.logo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 23"
              width="18"
              height="18"
              style={{ marginRight: "8px", fill: "var(--color-signal-blue)" }}
            >
              <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
            </svg>
            <span style={{ fontSize: "1.1rem", fontWeight: 750 }}>WinKey.vn</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-midnight-ink)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className={styles.mobileNavLinks}>
          <a href="/cua-hang" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            Cửa Hàng
          </a>
          <a href="/huong-dan" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            Hướng Dẫn
          </a>
          <a href="/#faq" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            Hỏi Đáp
          </a>
          <a href="/ho-tro" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            Hỗ Trợ
          </a>
          <a
            href="/#store"
            className="btn-grad"
            style={{ padding: "14px 28px", width: "100%", textAlign: "center", marginTop: "12px", display: "block" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Mua Ngay
          </a>
        </nav>
      </div>
    </>
  );
};
