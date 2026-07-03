"use client";

import React from "react";
import { ShieldCheck, Zap, Laptop, BadgeCheck, HelpCircle } from "lucide-react";
import styles from "./components.module.css";

export const BentoFeatures: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Bản Quyền Vĩnh Viễn",
      desc: "Key Retail chính hãng kích hoạt online trực tiếp với Microsoft Server. Nhận bản vá bảo mật và nâng cấp tính năng chính thức trọn đời máy."
    },
    {
      icon: <Laptop size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Cài Đặt Miễn Phí",
      desc: "Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng hỗ trợ cài đặt, kích hoạt từ xa qua Ultraview/Teamviewer hoàn toàn miễn phí."
    },
    {
      icon: <Zap size={28} style={{ color: "var(--color-signal-blue)" }} />,
      title: "Tự Động Bàn Giao",
      desc: "Nhận key kích hoạt kèm hướng dẫn chi tiết qua Email và Zalo chỉ 3 phút sau khi giao dịch chuyển khoản hoàn tất."
    }
  ];

  return (
    <section className={styles.bentoSection}>
      <div className={styles.container}>
        
        {/* Centered Section Header */}
        <div className={styles.sectionHeader}>
          <h2>Tại Sao Nên Chọn WinKey?</h2>
          <p>Đơn vị phân phối key bản quyền Windows & Office uy tín hàng đầu với dịch vụ hỗ trợ chất lượng cao.</p>
        </div>

        {/* Relate Style: Single Large Feature Section Card */}
        <div
          className="glass"
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-cardlarge)",
            boxShadow: "var(--shadow-xl-2)",
            padding: "52px 40px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "40px",
            }}
            className="featuresLargeCardGrid"
          >
            {features.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  textAlign: "left"
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "var(--color-sky-wash)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feat.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "var(--color-midnight-ink)"
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-ash)",
                    lineHeight: "1.6",
                    margin: 0
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid responsiveness styles */}
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
