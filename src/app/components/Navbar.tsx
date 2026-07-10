"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Package, Users } from "lucide-react";
import { useCart } from "../context/CartContext";
import styles from "./components.module.css";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/cua-hang", label: "Cửa hàng" },
  { href: "/huong-dan", label: "Hướng dẫn" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/#faq", label: "Hỏi đáp" },
  { href: "/ho-tro", label: "Hỗ trợ" },
];

function UserMenu() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Link
        href="/auth/sign-in"
        className={styles.navLink}
        style={{ fontWeight: 600, fontSize: "0.9rem" }}
      >
        Đăng nhập
      </Link>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu tài khoản"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar style={{ width: 36, height: 36 }}>
            <AvatarImage src={user.imageUrl} alt={user.fullName ?? "Avatar"} />
            <AvatarFallback
              style={{
                background: "var(--color-signal-blue, #2563eb)",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" style={{ minWidth: 200 }}>
        <DropdownMenuLabel>
          <div style={{ fontWeight: 600 }}>{user.fullName || "Tài khoản"}</div>
          <div style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.7 }}>
            {user.primaryEmailAddress?.emailAddress}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/tai-khoan" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <User size={15} />
            Tài khoản của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/tai-khoan/don-hang" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <Package size={15} />
            Đơn hàng
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/tai-khoan/affiliate" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <Users size={15} />
            Cộng tác viên
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--destructive, #ef4444)" }}
        >
          <LogOut size={15} />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
              viewBox="0 0 88 88"
              width="24"
              height="24"
              style={{ marginRight: "8px", fill: "#00a4ef" }}
            >
              <path d="M0 12.402l35.687-4.86.016 34.423h-35.703v-29.563zm39.866-5.495l48.134-6.907v40.366h-48.134v-33.459zm0 41.01h48.134v40.354l-48.134-6.914v-33.44zm-39.866 1.439h35.703v29.585l-35.703-4.856v-24.729z" />
            </svg>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.5px" }}>WinKey.vn</span>
          </Link>

          <nav className={styles.navLinks}>
            {navLinks.map((item) => (
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

            {/* User menu — visible on desktop */}
            <div className="hidden md:flex">
              <UserMenu />
            </div>

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

      {/* Mobile slide-in menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
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
              <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H12zM12 12h11v11H12z" />
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
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile user links */}
          <div style={{ padding: "12px 24px 0", borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 8 }}>
            <MobileUserSection onClose={() => setIsMobileMenuOpen(false)} />
          </div>

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

function MobileUserSection({ onClose }: { onClose: () => void }) {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Link
        href="/auth/sign-in"
        className={styles.mobileNavLink}
        onClick={onClose}
        style={{ display: "block", paddingBottom: 8 }}
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <>
      <Link href="/tai-khoan" className={styles.mobileNavLink} onClick={onClose} style={{ display: "block" }}>
        Tài khoản của tôi
      </Link>
      <Link href="/tai-khoan/don-hang" className={styles.mobileNavLink} onClick={onClose} style={{ display: "block" }}>
        Đơn hàng
      </Link>
      <Link href="/tai-khoan/affiliate" className={styles.mobileNavLink} onClick={onClose} style={{ display: "block" }}>
        Cộng tác viên
      </Link>
      <button
        onClick={() => {
          onClose();
          signOut({ redirectUrl: "/" });
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--destructive, #ef4444)",
          fontSize: "0.9rem",
          fontWeight: 600,
          padding: "8px 0",
          display: "block",
          width: "100%",
          textAlign: "left",
        }}
      >
        Đăng xuất
      </button>
    </>
  );
}
