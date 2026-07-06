"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../../../components/components.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const articles = {
  "windows-11-activation": {
    title: "Cách kích hoạt Windows 11/10 bằng Product Key",
    category: "Kích hoạt",
    lastUpdated: "06/07/2026",
    content: [
      "Mở Settings bằng tổ hợp Windows + I, sau đó truy cập System > Activation để kiểm tra trạng thái hiện tại của máy.",
      "Chọn Change product key, nhập đúng chuỗi 25 ký tự rồi nhấn Next. Hệ thống sẽ xác thực trực tiếp với máy chủ Microsoft.",
      "Sau khi kích hoạt thành công, kiểm tra dòng trạng thái Digital license hoặc thông báo tương đương để xác nhận máy đã nhận bản quyền."
    ]
  },
  "office-2021-install": {
    title: "Hướng dẫn cài Office 2021 Professional Plus",
    category: "Cài đặt",
    lastUpdated: "06/07/2026",
    content: [
      "Gỡ toàn bộ phiên bản Office cũ trước khi cài để tránh xung đột key và bộ cài.",
      "Cài bộ Office sạch, sau đó mở Word hoặc Excel, vào File > Account và chọn Change Product Key.",
      "Nhập key chính hãng, chờ hoàn tất kích hoạt rồi kiểm tra lại trạng thái tài khoản hoặc bản quyền trong màn hình Account."
    ]
  },
  "microsoft-account-link": {
    title: "Liên kết bản quyền vào tài khoản Microsoft",
    category: "Tài khoản",
    lastUpdated: "06/07/2026",
    content: [
      "Đăng nhập tài khoản Microsoft trên thiết bị đã kích hoạt để đồng bộ giấy phép số khi sản phẩm hỗ trợ.",
      "Trong phần Activation hoặc Account, kiểm tra xem hệ thống đã hiển thị bản quyền gắn với tài khoản hay chưa.",
      "Cách này giúp thuận tiện hơn khi cài lại máy hoặc cần xác minh quyền sử dụng trong quá trình hỗ trợ."
    ]
  },
  "activation-errors": {
    title: "Khắc phục các lỗi kích hoạt thường gặp",
    category: "Sửa lỗi",
    lastUpdated: "06/07/2026",
    content: [
      "Kiểm tra xem key có đúng phiên bản Windows hoặc Office đang dùng hay không.",
      "Đảm bảo máy có kết nối internet ổn định và ngày giờ hệ thống chính xác trước khi thử lại.",
      "Nếu vẫn lỗi, gửi ảnh chụp màn hình và mã lỗi qua trang hỗ trợ để đội WinKey kiểm tra ticket ngay trên hệ thống."
    ]
  }
} as const;

export default function GuideDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const article = articles[slug as keyof typeof articles] ?? {
    title: "Tài liệu hỗ trợ WinKey",
    category: "Tài liệu",
    lastUpdated: "06/07/2026",
    content: [
      "Tài liệu này đang được cập nhật thêm nội dung chi tiết.",
      "Nếu bạn cần hỗ trợ ngay, vui lòng dùng biểu mẫu hỗ trợ để gửi yêu cầu trực tiếp vào hệ thống."
    ]
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", background: "#fcfcfc", minHeight: "100vh" }}>
      <div className={styles.container}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link
            href="/huong-dan"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--color-ash)", textDecoration: "none", marginBottom: "32px", fontWeight: 600 }}
            className="back-btn"
          >
            <ArrowLeft size={16} />
            <span>Quay lại danh sách hướng dẫn</span>
          </Link>

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
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--color-midnight-ink)", lineHeight: "1.3", marginBottom: "10px" }}>
              {article.title}
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--color-ash)", margin: 0 }}>
              Cập nhật: {article.lastUpdated}
            </p>
          </div>

          <div style={{ fontSize: "0.95rem", color: "var(--color-midnight-ink)", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "14px" }}>
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
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
