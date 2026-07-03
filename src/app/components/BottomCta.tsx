"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Mail, Sparkles } from "lucide-react";
import styles from "./components.module.css";

export const BottomCta: React.FC = () => {
  return (
    <section className={styles.bottomCtaSection}>
      <div className={styles.container}>
        <div className={styles.ctaCard}>
          {/* Left Column content info */}
          <div className={styles.ctaWrapper}>
            <h2 className={styles.ctaTitle}>
              Nâng Cấp Thiết Bị Của Bạn Ngay Hôm Nay
            </h2>
            <p className={styles.ctaDesc}>
              Đừng để các thông báo hết hạn hay rủi ro bảo mật từ các công cụ crack làm gián đoạn công việc của bạn. Hãy trang bị Windows & Office bản quyền chính hãng ngay hôm nay.
            </p>
            <a href="#store" className="btn-grad" style={{ padding: "16px 36px", fontSize: "0.95rem", textTransform: "none", borderRadius: "100px" }}>
              Xem Bảng Giá Key Bản Quyền
            </a>
          </div>

          {/* Right Column visual: Layered floating software card */}
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
            {/* Soft decorative glow behind the card */}
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

            {/* The Floating Activation Card */}
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
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src="https://thesvg.org/icons/microsoft-office/default.svg" alt="Office" width="20" height="20" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>Microsoft Office</span>
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
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={8} />
                  <span>Đã Kích Hoạt</span>
                </div>
              </div>

              {/* Card body text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>Office 2021 Professional Plus</span>
                <span style={{ fontSize: "0.6rem", color: "var(--color-ash)" }}>Bản quyền vĩnh viễn trọn đời máy</span>
              </div>

              {/* Sub features list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.6rem", color: "var(--color-ash)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={10} color="var(--color-signal-blue)" />
                  <span>Kích hoạt online trực tiếp 100%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={10} color="var(--color-signal-blue)" />
                  <span>Gửi key tự động qua Email trong 3 phút</span>
                </div>
              </div>
            </div>

            {/* Overlapping small badge card */}
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
                100% Genuine Partner
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
