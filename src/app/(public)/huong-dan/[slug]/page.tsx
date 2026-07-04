"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from "lucide-react";
import styles from "../../../components/components.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GuideDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const getArticleData = () => {
    switch (slug) {
      case "windows-11-activation":
        return {
          title: "Cách kích hoạt bản quyền Windows 11/10 bằng Product Key",
          category: "Kích Hoạt",
          lastUpdated: "Gần đây nhất",
          content: (
            <>
              <p>Việc kích hoạt bản quyền Windows 11 Pro hoặc Home vô cùng đơn giản và an toàn thông qua máy chủ kích hoạt chính thức của Microsoft. Dưới đây là các bước kích hoạt trực tiếp từ Windows Settings:</p>
              
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 1: Mở mục Cài Đặt (Settings)</h3>
              <p>Nhấn tổ hợp phím <strong>Windows + I</strong> trên bàn phím của bạn để mở nhanh cửa sổ Cài đặt của Windows.</p>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 2: Tìm đến trang Kích Hoạt</h3>
              <p>Trong thanh menu bên trái, chọn mục <strong>System</strong> (Hệ thống), sau đó cuộn xuống và chọn <strong>Activation</strong> (Kích hoạt) ở khung bên phải.</p>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 3: Nhập Key Bản Quyền</h3>
              <p>Nhấp vào mục <strong>Change product key</strong> (Thay đổi mã sản phẩm), sau đó nhập chuỗi 25 ký tự bản quyền bạn đã mua vào ô trống.</p>
              <div 
                style={{ 
                  background: "#f1f5f9", 
                  border: "1px solid rgba(0,0,0,0.06)", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  fontFamily: "var(--font-roboto-mono)",
                  fontSize: "0.9rem",
                  margin: "16px 0",
                  textAlign: "center",
                  color: "var(--color-signal-blue)",
                  fontWeight: 700
                }}
              >
                XXXXX - XXXXX - XXXXX - XXXXX - XXXXX
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 4: Nhấn Active và Hoàn Thành</h3>
              <p>Sau khi nhập xong key, nhấn <strong>Next</strong> và chọn <strong>Activate</strong>. Windows sẽ kết nối trực tiếp đến máy chủ Microsoft và hiển thị thông báo kích hoạt thành công dạng <em>"Windows is activated with a digital license"</em>.</p>
            </>
          )
        };
      case "office-2021-install":
        return {
          title: "Hướng dẫn cài đặt Office 2021 Professional Plus chính thức",
          category: "Cài Đặt",
          lastUpdated: "Gần đây nhất",
          content: (
            <>
              <p>Để đảm bảo hiệu năng tối ưu và an toàn bảo mật tuyệt đối, bạn nên tải phần mềm cài đặt bộ Microsoft Office 2021 Professional Plus trực tiếp từ hệ thống phân phối của Microsoft:</p>
              
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 1: Gỡ bỏ phiên bản cũ</h3>
              <p>Trước khi cài đặt, hãy truy cập <strong>Control Panel &gt; Uninstall a program</strong> để gỡ bỏ hoàn toàn mọi phiên bản Office cũ (Office 365, Office 2016, v.v.) đang có trên máy nhằm tránh xung đột bản quyền.</p>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 2: Tải file cài đặt gốc</h3>
              <p>Tải tệp cài đặt trực tiếp dạng IMG hoặc ISO từ trang chủ Microsoft CDN để tiến hành cài đặt cài đặt an toàn.</p>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "24px", marginBottom: "12px", color: "var(--color-midnight-ink)" }}>Bước 3: Nhập Key Kích Hoạt</h3>
              <p>Mở bất kỳ ứng dụng văn phòng nào (ví dụ: Word hoặc Excel), click chọn <strong>File &gt; Account</strong> (hoặc Tài khoản), sau đó chọn <strong>Change Product Key</strong> và điền mã key chính hãng 25 ký tự để kích hoạt tài khoản sử dụng trọn đời máy.</p>
            </>
          )
        };
      default:
        return {
          title: "Hướng dẫn xử lý các vấn đề bản quyền Microsoft",
          category: "Tài Liệu",
          lastUpdated: "Hôm nay",
          content: (
            <>
              <p>Chúng tôi cung cấp tài liệu chi tiết hỗ trợ người dùng tự giải quyết các thắc mắc thường gặp về bản quyền kỹ thuật số của Microsoft.</p>
              <p>Nếu bạn gặp bất kỳ trở ngại nào trong quá trình cài đặt, vui lòng liên hệ hotline hỗ trợ kỹ thuật 24/7 của chúng tôi để được tư vấn cài đặt miễn phí qua Zalo/UltraViewer.</p>
            </>
          )
        };
    }
  };

  const article = getArticleData();

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", background: "#fcfcfc", minHeight: "100vh" }}>
      <div className={styles.container}>
        
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Back button */}
          <Link 
            href="/huong-dan" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              fontSize: "0.85rem", 
              color: "var(--color-ash)", 
              textDecoration: "none",
              marginBottom: "32px",
              fontWeight: 600
            }}
            className="back-btn"
          >
            <ArrowLeft size={16} />
            <span>Quay lại hướng dẫn</span>
          </Link>

          {/* Article Header */}
          <div style={{ marginBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "24px" }}>
            <span 
              style={{ 
                fontSize: "0.7rem", 
                fontWeight: 700, 
                color: "var(--color-signal-blue)",
                background: "rgba(20, 90, 255, 0.05)",
                padding: "4px 10px",
                borderRadius: "100px",
                display: "inline-block",
                marginBottom: "12px"
              }}
            >
              {article.category}
            </span>
            <h1 
              style={{ 
                fontSize: "2.2rem", 
                fontWeight: 800, 
                color: "var(--color-midnight-ink)", 
                lineHeight: "1.3",
                marginBottom: "10px"
              }}
            >
              {article.title}
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--color-ash)", margin: 0 }}>
              Cập nhật: {article.lastUpdated}
            </p>
          </div>

          {/* Article body content */}
          <div 
            style={{ 
              fontSize: "0.95rem", 
              color: "var(--color-midnight-ink)", 
              lineHeight: "1.7",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {article.content}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .back-btn:hover {
          color: var(--color-signal-blue) !important;
        }
      `}</style>
    </div>
  );
}
