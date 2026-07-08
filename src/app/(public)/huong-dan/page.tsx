import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import styles from "../../components/components.module.css";
import { getPublicGuides } from "@/lib/catalog";

export const dynamic = 'force-dynamic';

function getIcon(category: string) {
  switch (category) {
    case 'windows': return <BookOpen size={20} color="var(--color-signal-blue)" />;
    case 'office': return <Sparkles size={20} color="var(--color-signal-blue)" />;
    default: return <HelpCircle size={20} color="var(--color-signal-blue)" />;
  }
}

export default async function GuidesPage() {
  const articles = await getPublicGuides();

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
          {articles.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">
              Hiện tại chưa có bài hướng dẫn nào.
            </div>
          ) : (
            articles.map((article: { slug: string; category: string; title: string; content: string }) => (
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
                        {getIcon(article.category)}
                      </div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--color-signal-blue)",
                          background: "rgba(20, 90, 255, 0.05)",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          textTransform: "capitalize"
                        }}
                      >
                        {article.category === 'general' ? 'Chung' : article.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "8px", lineHeight: "1.4" }}>
                      {article.title}
                    </h3>

                    <div 
                      className="text-sm text-gray-500 line-clamp-3 mb-6"
                      dangerouslySetInnerHTML={{ __html: article.content.substring(0, 150) + '...' }}
                    />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
