"use client";

import Link from "next/link";
import React from "react";
import { CheckCircle2, ShieldCheck, Mail, Sparkles } from "lucide-react";
import styles from "./components.module.css";

export const BottomCta: React.FC = () => {
  return (
    <section className={styles.bottomCtaSection}>
      <div className={styles.container}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaWrapper}>
            <h2 className={styles.ctaTitle}>Đưa catalog WinKey vào trạng thái bán hàng đồng bộ</h2>
            <p className={styles.ctaDesc}>
              Sản phẩm trên landing page, trang cửa hàng và khu admin hiện đang được làm sạch nội dung, ảnh và quy trình bàn giao để đội ngũ có thể vận hành thống nhất.
            </p>
            <Link
              href="/cua-hang"
              className="btn-grad"
              style={{ padding: "16px 36px", fontSize: "0.95rem", textTransform: "none", borderRadius: "100px" }}
            >
              Mở catalog sản phẩm
            </Link>
          </div>

          <div
            className="cta-visual-column"
            style={{
              position: "relative",
              height: "260px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                background: "radial-gradient(circle, rgba(20, 90, 255, 0.08) 0%, rgba(20, 90, 255, 0) 70%)",
                filter: "blur(20px)",
                zIndex: 1
              }}
            />

            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "12px",
                boxShadow: "0 20px 40px -15px rgba(20, 90, 255, 0.08)",
                padding: "20px",
                width: "280px",
                maxWidth: "calc(100% - 20px)",
                textAlign: "left",
                zIndex: 2,
                position: "relative",
                transform: "rotate(-2deg) translateY(-10px)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: "var(--color-sky-wash)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ShieldCheck size={12} color="var(--color-signal-blue)" />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>WinKey Catalog</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    background: "rgba(22, 202, 46, 0.08)",
                    color: "var(--color-emerald-status)",
                    padding: "2px 6px",
                    borderRadius: "100px",
                    fontSize: "0.55rem",
                    fontWeight: 700
                  }}
                >
                  <CheckCircle2 size={8} />
                  <span>Đồng bộ</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>
                  Microsoft 365 Personal
                </span>
                <span style={{ fontSize: "0.6rem", color: "var(--color-ash)" }}>
                  Gói theo năm, có nhắc gia hạn và bàn giao linh hoạt
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.6rem", color: "var(--color-ash)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={10} color="var(--color-signal-blue)" />
                  <span>Dữ liệu storefront lấy từ PostgreSQL</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={10} color="var(--color-signal-blue)" />
                  <span>Nhắc gia hạn qua email cho gói 12 tháng</span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#020520",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                padding: "8px 12px",
                position: "absolute",
                bottom: "20px",
                right: "20px",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transform: "rotate(3deg) translateY(10px)"
              }}
            >
              <Sparkles size={10} color="#ffa64d" />
              <span style={{ fontSize: "0.55rem", color: "#ffffff", fontWeight: 700 }}>
                Core production
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
