"use client";

import React from "react";
import Link from "next/link";
import styles from "./components.module.css";

const quickLinks = [
  { href: "/cua-hang", label: "Cửa hàng" },
  { href: "/huong-dan", label: "Hướng dẫn kích hoạt" },
  { href: "/tin-tuc", label: "Tin tức & Cập nhật" },
  { href: "/ho-tro", label: "Gửi yêu cầu hỗ trợ" },
  { href: "/tai-khoan/affiliate", label: "Cộng tác viên" },
];

const policyLinks = [
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan-dich-vu", label: "Điều khoản dịch vụ" },
  { href: "/admin", label: "Khu quản trị" },
];

export const Footer: React.FC = () => {
  return (
    <footer id="support" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol} style={{ gridColumn: "span 2" }}>
            <div className={styles.footerLogo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 23 23"
                width="20"
                height="20"
                style={{ marginRight: "8px", fill: "#ffffff" }}
              >
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
              <span>WinKey.vn</span>
            </div>
            <p className={styles.footerDesc} style={{ maxWidth: "320px" }}>
              WinKey.vn cung cấp bản quyền Windows, Office và các gói phần mềm
              Microsoft phù hợp cho cá nhân, kỹ thuật viên và đội vận hành nội bộ.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <a
                href="https://facebook.com/winkeyvn"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Facebook WinKey"
              >
                Facebook
              </a>
              <a
                href="https://zalo.me/0988888888"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Zalo WinKey"
              >
                Zalo
              </a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Điểm đến nhanh</h4>
            <ul className={styles.footerLinks}>
              {quickLinks.map((link) => (
                <li key={link.href} className={styles.footerLink}>
                  <Link href={link.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Thông tin liên hệ</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>Zalo: 0988 888 888</li>
              <li className={styles.footerLink}>Email: support@winkey.vn</li>
              <li className={styles.footerLink}>Giờ hỗ trợ: 07:00 – 23:00</li>
              <li className={styles.footerLink}>Hình thức bàn giao: online, ship mã, ship đĩa</li>
            </ul>

            <h4 className={styles.footerColTitle} style={{ marginTop: 20 }}>Chính sách</h4>
            <ul className={styles.footerLinks}>
              {policyLinks.map((link) => (
                <li key={link.href} className={styles.footerLink}>
                  <Link href={link.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} WinKey.vn. Vận hành storefront và admin
            trên cùng một nguồn dữ liệu.
          </p>
          <div className={styles.paymentBadges}>
            <span className={styles.paymentBadge}>Chuyển khoản</span>
            <span className={styles.paymentBadge}>MoMo</span>
            <span className={styles.paymentBadge}>Email</span>
            <span className={styles.paymentBadge}>Zalo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
