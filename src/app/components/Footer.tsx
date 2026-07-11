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
          <div className={`${styles.footerCol} ${styles.footerColWide}`}>
            <div className={styles.footerLogo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 88 88"
                width="24"
                height="24"
                style={{ marginRight: "8px", fill: "#ffffff" }}
              >
                <path d="M0 12.402l35.687-4.86.016 34.423h-35.703v-29.563zm39.866-5.495l48.134-6.907v40.366h-48.134v-33.459zm0 41.01h48.134v40.354l-48.134-6.914v-33.44zm-39.866 1.439h35.703v29.585l-35.703-4.856v-24.729z" />
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
