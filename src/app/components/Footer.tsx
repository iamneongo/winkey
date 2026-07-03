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
            <p className={styles.footerDesc} style={{ maxWidth: "300px" }}>
              WinKey.vn chuyên cung cấp các sản phẩm key bản quyền chính hãng Microsoft Windows, Office và phần mềm bản quyền giá tốt nhất Việt Nam.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Dịch Vụ & Hỗ Trợ</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>
                <Link href="/ho-tro" style={{ color: "inherit", textDecoration: "none" }}>Yêu Cầu Hỗ Trợ</Link>
              </li>
              <li className={styles.footerLink}>
                <Link href="/huong-dan" style={{ color: "inherit", textDecoration: "none" }}>Hướng Dẫn Kích Hoạt</Link>
              </li>
              <li className={styles.footerLink}>Zalo: 0988.888.888</li>
              <li className={styles.footerLink}>Email: support@winkey.vn</li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Chính Sách</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLink}>Chính sách bảo mật</li>
              <li className={styles.footerLink}>Chính sách bảo hành</li>
              <li className={styles.footerLink}>Điều khoản dịch vụ</li>
              <li className={styles.footerLink}>Chính sách hoàn tiền</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} WinKey.vn. Tất cả quyền được bảo lưu.</p>
          <div className={styles.paymentBadges} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ height: "22px", display: "flex", alignItems: "center" }}>
              <img src="https://thesvg.org/icons/visa/default.svg" alt="Visa" style={{ height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ height: "22px", display: "flex", alignItems: "center" }}>
              <img src="https://thesvg.org/icons/mastercard/default.svg" alt="Mastercard" style={{ height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ height: "22px", display: "flex", alignItems: "center" }}>
              <img src="https://thesvg.org/icons/paypal/default.svg" alt="PayPal" style={{ height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ height: "22px", display: "flex", alignItems: "center" }}>
              <img src="https://thesvg.org/icons/apple-pay/default.svg" alt="Apple Pay" style={{ height: "100%", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
