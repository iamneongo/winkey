"use client";

import React, { useState } from "react";
import { Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import styles from "../../components/components.module.css";

type SupportIssue = "windows" | "office" | "payment" | "other";

type SupportResponse = {
  success: boolean;
  message: string;
  request?: {
    id: number;
    created_at: string;
  };
};

export default function SupportPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState<SupportIssue>("windows");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setFormSubmitted(false);
    setSubmitting(false);
    setErrorMessage("");
    setTicketId(null);
    setName("");
    setEmail("");
    setIssue("windows");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          issue,
          message
        })
      });

      const result = (await response.json()) as SupportResponse;

      if (!response.ok || !result.success) {
        setErrorMessage(result.message || "Không thể gửi yêu cầu hỗ trợ lúc này.");
        return;
      }

      setTicketId(result.request?.id ?? null);
      setFormSubmitted(true);
    } catch {
      setErrorMessage("Không thể kết nối tới hệ thống hỗ trợ. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className={styles.sectionHeader} style={{ marginBottom: "50px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>
            Hỗ trợ kỹ thuật
          </h1>
          <p style={{ maxWidth: "600px", margin: "12px auto 0 auto" }}>
            Yêu cầu của bạn sẽ được lưu vào hệ thống để đội ngũ WinKey tiếp nhận và phản hồi theo ticket.
          </p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "48px", maxWidth: "1000px", margin: "0 auto" }}
          className="support-grid"
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "12px",
              padding: "40px",
              boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.03)"
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <CheckCircle2 size={54} color="var(--color-emerald-status)" style={{ marginBottom: "16px" }} />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "8px" }}>
                  Đã ghi nhận yêu cầu hỗ trợ
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--color-ash)", maxWidth: "420px", margin: "0 auto 12px auto" }}>
                  Ticket của bạn đã được lưu vào cơ sở dữ liệu. Đội ngũ WinKey có thể dùng mã ticket để tra cứu và phản hồi nhanh hơn.
                </p>
                {ticketId ? (
                  <p style={{ fontWeight: 700, color: "var(--color-signal-blue)", marginBottom: "20px" }}>
                    Mã ticket: #{ticketId}
                  </p>
                ) : null}
                <button className="btn-outline" onClick={resetForm} style={{ padding: "10px 20px" }}>
                  Gửi yêu cầu mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "4px" }}>
                  Gửi yêu cầu hỗ trợ
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>HỌ VÀ TÊN</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      style={fieldStyle}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>EMAIL</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>LOẠI YÊU CẦU</label>
                  <select value={issue} onChange={(event) => setIssue(event.target.value as SupportIssue)} style={fieldStyle}>
                    <option value="windows">Windows 10/11</option>
                    <option value="office">Microsoft Office / Microsoft 365</option>
                    <option value="payment">Thanh toán / bàn giao</option>
                    <option value="other">Yêu cầu khác</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>NỘI DUNG</label>
                  <textarea
                    rows={5}
                    placeholder="Mô tả chi tiết lỗi, sản phẩm đang dùng và tình trạng hiện tại..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    style={{ ...fieldStyle, resize: "none" }}
                  />
                </div>

                {errorMessage ? (
                  <div style={{ borderRadius: 10, background: "rgba(239, 68, 68, 0.08)", color: "#b91c1c", padding: "12px 14px", fontSize: "0.85rem" }}>
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="btn-grad"
                  disabled={submitting}
                  style={{ padding: "14px 28px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", border: "none" }}
                >
                  <Send size={16} />
                  <span>{submitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu hỗ trợ"}</span>
                </button>
              </form>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <InfoCard icon={<Phone size={20} color="var(--color-signal-blue)" />} title="Hotline / Zalo" value="0988 888 888" description="Hỗ trợ từ xa qua UltraViewer khi cần kiểm tra trực tiếp thiết bị." />
            <InfoCard icon={<Mail size={20} color="var(--color-signal-blue)" />} title="Email hỗ trợ" value="support@winkey.vn" description="Phù hợp các yêu cầu cần lưu vết trao đổi hoặc gửi ảnh chụp màn hình." />
            <InfoCard icon={<Clock size={20} color="var(--color-signal-blue)" />} title="Khung giờ tiếp nhận" value="07:00 - 23:00 mỗi ngày" description="Ticket vẫn được lưu ngoài giờ để đội ngũ xử lý ngay khi ca làm việc bắt đầu." />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 968px) {
          .support-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: "12px",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  fontSize: "0.85rem",
  outline: "none",
  background: "#ffffff"
};

function InfoCard({
  icon,
  title,
  value,
  description
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.03)",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "8px",
          background: "var(--color-sky-wash)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {icon}
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>{title}</h4>
        <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>{value}</p>
        <span style={{ fontSize: "0.75rem", color: "var(--color-ash)" }}>{description}</span>
      </div>
    </div>
  );
}
