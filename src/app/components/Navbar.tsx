"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./components.module.css";

const mobileLinks = [
  { href: "/cua-hang", label: "Cửa hàng" },
  { href: "/huong-dan", label: "Hướng dẫn" },
  { href: "/#faq", label: "Hỏi đáp" },
  { href: "/ho-tro", label: "Hỗ trợ" }
];

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOverlayOpen : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navbarInner}>
          <Link className={styles.logo} href="/">
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
          </Link>

          <nav className={styles.navLinks}>
            {mobileLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)} aria-label="Xem giỏ hàng">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>

            <Link
              href="/cua-hang"
              className="btn-grad"
              style={{ padding: "8px 18px", fontSize: "0.85rem", textTransform: "none", borderRadius: "100px" }}
            >
              Mua ngay
            </Link>

            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
          }}
        >
          <Link className={styles.logo} href="/" onClick={() => setIsMobileMenuOpen(false)}>
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
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-midnight-ink)" }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.mobileNavLinks}>
          {mobileLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cua-hang"
            className="btn-grad"
            style={{ padding: "14px 28px", width: "100%", textAlign: "center", marginTop: "12px", display: "block" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Xem bảng giá
          </Link>
        </nav>
      </div>
    </>
  );
};
