"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import styles from "../../components/components.module.css";

const articles = [
  {
    slug: "windows-11-activation",
    title: "Cách kích hoạt Windows 11/10 bằng Product Key",
    desc: "Từng bước nhập key trực tiếp trong Settings và kiểm tra trạng thái bản quyền sau khi kích hoạt.",
    category: "Kích hoạt",
    icon: <BookOpen size={20} color="var(--color-signal-blue)" />
  },
  {
    slug: "office-2021-install",
    title: "Hướng dẫn cài Office 2021 Professional Plus",
    desc: "Quy trình gỡ bản cũ, cài bộ cài sạch và kích hoạt đúng cách để tránh xung đột bản quyền.",
    category: "Cài đặt",
    icon: <Sparkles size={20} color="var(--color-signal-blue)" />
  },
  {
    slug: "microsoft-account-link",
    title: "Liên kết bản quyền vào tài khoản Microsoft",
    desc: "Giúp khách dễ phục hồi bản quyền khi cài lại máy hoặc thay đổi phần cứng trong giới hạn cho phép.",
    category: "Tài khoản",
    icon: <HelpCircle size={20} color="var(--color-signal-blue)" />
  },
  {
    slug: "activation-errors",
    title: "Khắc phục các lỗi kích hoạt thường gặp",
    desc: "Tổng hợp hướng xử lý nhanh cho những mã lỗi hay gặp khi nhập key Windows hoặc Office.",
    category: "Sửa lỗi",
    icon: <ShieldAlert size={20} color="var(--color-signal-blue)" />
  }
];

export default function GuidesPage() {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", background: "#fcfcfc", minHeight: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1400px",
          height: "300px",
          background: "radial-gradient(circle, rgba(20, 90, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div className={styles.container} style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.sectionHeader} style={{ marginBottom: "60px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>
            Hướng dẫn sử dụng
          </h1>
          <p style={{ maxWidth: "620px", margin: "12px auto 0 auto" }}>
            Tài liệu dành cho khách hàng và đội hỗ trợ khi cần cài đặt, kích hoạt hoặc xử lý các sự cố bản quyền Microsoft.
          </p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", maxWidth: "960px", margin: "0 auto" }}
          className="guides-grid"
        >
          {articles.map((article) => (
            <Link key={article.slug} href={`/huong-dan/${article.slug}`} style={{ textDecoration: "none" }}>
              <div
                className="guide-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                  padding: "30px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        background: "var(--color-sky-wash)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {article.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "var(--color-signal-blue)",
                        background: "rgba(20, 90, 255, 0.05)",
                        padding: "4px 10px",
                        borderRadius: "100px"
                      }}
                    >
                      {article.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "8px", lineHeight: "1.4" }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: "0.85rem", color: "var(--color-ash)", lineHeight: "1.6", marginBottom: "24px" }}>
                    {article.desc}
                  </p>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-signal-blue)" }}
                  className="read-link"
                >
                  <span>Đọc hướng dẫn</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .guides-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        .guide-card:hover {
          transform: translateY(-4px);
          border-color: rgba(20, 90, 255, 0.15) !important;
          box-shadow: 0 20px 40px -20px rgba(20, 90, 255, 0.08) !important;
        }
        .guide-card:hover .read-link {
          gap: 10px !important;
          transition: gap 0.2s ease;
        }
      `}</style>
    </div>
  );
}
