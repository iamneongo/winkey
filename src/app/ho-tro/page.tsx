"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import styles from "../components/components.module.css";

export default function SupportPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("windows");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate API request
    setFormSubmitted(true);
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", background: "#fcfcfc", minHeight: "100vh" }}>
      {/* Background radial glow */}
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
        {/* Section Header */}
        <div className={styles.sectionHeader} style={{ marginBottom: "50px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>
            Hỗ Trợ Kỹ Thuật
          </h1>
          <p style={{ maxWidth: "600px", margin: "12px auto 0 auto" }}>
            Đội ngũ chuyên viên của WinKey luôn sẵn sàng trợ giúp bạn cài đặt, xử lý lỗi kích hoạt bản quyền 24/7.
          </p>
        </div>

        {/* Layout: Form on left, Info channels on right */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "48px",
            maxWidth: "1000px",
            margin: "0 auto"
          }}
          className="support-grid"
        >
          {/* Support Request Form Card */}
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
                  Yêu Cầu Đã Được Gửi!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--color-ash)", maxWidth: "380px", margin: "0 auto 24px auto" }}>
                  Chúng tôi đã nhận được thông báo hỗ trợ từ bạn. Nhân viên hỗ trợ sẽ liên hệ trực tiếp qua Zalo/Email trong vòng 10-15 phút.
                </p>
                <button 
                  className="btn-outline" 
                  onClick={() => {
                    setFormSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  style={{ padding: "10px 20px" }}
                >
                  Gửi yêu cầu mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "4px" }}>
                  Gửi Yêu Cầu Hỗ Trợ
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>HỌ & TÊN</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ 
                        padding: "12px", 
                        border: "1px solid rgba(0, 0, 0, 0.1)", 
                        borderRadius: "8px", 
                        fontSize: "0.85rem",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>EMAIL CỦA BẠN</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ 
                        padding: "12px", 
                        border: "1px solid rgba(0, 0, 0, 0.1)", 
                        borderRadius: "8px", 
                        fontSize: "0.85rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>LOẠI SẢN PHẨM CẦN TRỢ GIÚP</label>
                  <select 
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    style={{ 
                      padding: "12px", 
                      border: "1px solid rgba(0, 0, 0, 0.1)", 
                      borderRadius: "8px", 
                      fontSize: "0.85rem",
                      background: "#ffffff",
                      outline: "none"
                    }}
                  >
                    <option value="windows">Bản quyền Windows (10/11)</option>
                    <option value="office">Bản quyền Microsoft Office (2021/365)</option>
                    <option value="payment">Vấn đề thanh toán / Giao hàng</option>
                    <option value="other">Yêu cầu hỗ trợ khác</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>NỘI DUNG YÊU CẦU</label>
                  <textarea 
                    rows={5}
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải (ví dụ: mã lỗi hiển thị, trạng thái cài đặt)..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ 
                      padding: "12px", 
                      border: "1px solid rgba(0, 0, 0, 0.1)", 
                      borderRadius: "8px", 
                      fontSize: "0.85rem",
                      resize: "none",
                      outline: "none"
                    }}
                  />
                </div>

                <button type="submit" className="btn-grad" style={{ padding: "14px 28px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", border: "none" }}>
                  <Send size={16} />
                  <span>Gửi Yêu Cầu Hỗ Trợ</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Live Chat Hotline info */}
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
                <Phone size={20} color="var(--color-signal-blue)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>Đường Dây Nóng / Zalo</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 750, color: "var(--color-signal-blue)" }}>0988.888.888</p>
                <span style={{ fontSize: "0.75rem", color: "var(--color-ash)" }}>Hỗ trợ cài đặt từ xa qua Ultraview miễn phí.</span>
              </div>
            </div>

            {/* Email Box */}
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
                <Mail size={20} color="var(--color-signal-blue)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>Hòm Thư Hỗ Trợ</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>support@winkey.vn</p>
                <span style={{ fontSize: "0.75rem", color: "var(--color-ash)" }}>Phản hồi thư điện tử trong vòng 30 phút làm việc.</span>
              </div>
            </div>

            {/* Working Time Box */}
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
                <Clock size={20} color="var(--color-signal-blue)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "var(--color-midnight-ink)" }}>Giờ Làm Việc</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", fontWeight: 650, color: "var(--color-midnight-ink)" }}>Thứ Hai - Chủ Nhật: 07:00 - 23:00</p>
                <span style={{ fontSize: "0.75rem", color: "var(--color-ash)" }}>Làm việc xuyên các ngày lễ Tết.</span>
              </div>
            </div>

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
