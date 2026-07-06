"use client";

import React from "react";
import { ShieldCheck, Zap, Laptop } from "lucide-react";
import styles from "./components.module.css";

export const BentoFeatures: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Bản quyền rõ nguồn gốc",
      desc: "Sản phẩm đang hiển thị trên storefront được lấy trực tiếp từ hệ thống quản trị và có mô tả, giá bán, ảnh minh họa đồng nhất."
    },
    {
      icon: <Laptop size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Hỗ trợ cài đặt từ xa",
      desc: "Khách hàng có thể gửi yêu cầu hỗ trợ kỹ thuật ngay trên website để đội ngũ WinKey tiếp nhận và xử lý theo ticket."
    },
    {
      icon: <Zap size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Bàn giao linh hoạt",
      desc: "Hỗ trợ nhận key online, ship mã bản quyền hoặc bàn giao đĩa cứng tùy loại sản phẩm và nhu cầu của khách hàng."
    }
  ];

  return (
    <section className={styles.bentoSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Vì sao chọn WinKey</h2>
          <p>Luồng dữ liệu, nội dung và hỗ trợ sau bán đang được đồng bộ để storefront và admin hoạt động như một hệ thống thống nhất.</p>
        </div>

        <div
          className="glass"
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-cardlarge)",
            boxShadow: "var(--shadow-xl-2)",
            padding: "52px 40px",
            border: "1px solid rgba(0,0,0,0.06)"
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}
            className="featuresLargeCardGrid"
          >
            {features.map((feature) => (
              <div key={feature.title} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "var(--color-sky-wash)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {feature.icon}
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>{feature.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-ash)", lineHeight: "1.6", margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 968px) {
          .featuresLargeCardGrid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
};
