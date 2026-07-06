"use client";

import React from "react";
import Link from "next/link";
import styles from "./components.module.css";

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
              WinKey.vn cung cấp bản quyền Windows, Office và các gói phần mềm Microsoft phù hợp cho cá nhân, kỹ thuật viên và đội vận hành nội bộ.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Điểm đến nhanh</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>
                <Link href="/cua-hang" style={{ color: "inherit", textDecoration: "none" }}>Cửa hàng</Link>
              </li>
              <li className={styles.footerLink}>
                <Link href="/huong-dan" style={{ color: "inherit", textDecoration: "none" }}>Hướng dẫn kích hoạt</Link>
              </li>
              <li className={styles.footerLink}>
                <Link href="/ho-tro" style={{ color: "inherit", textDecoration: "none" }}>Gửi yêu cầu hỗ trợ</Link>
              </li>
              <li className={styles.footerLink}>
                <Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>Khu quản trị</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Thông tin liên hệ</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>Zalo: 0988 888 888</li>
              <li className={styles.footerLink}>Email: support@winkey.vn</li>
              <li className={styles.footerLink}>Giờ hỗ trợ: 07:00 - 23:00</li>
              <li className={styles.footerLink}>Hình thức bàn giao: online, ship mã, ship đĩa</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} WinKey.vn. Vận hành storefront và admin trên cùng một nguồn dữ liệu.</p>
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
