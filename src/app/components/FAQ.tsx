"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./components.module.css";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Website hiện đã dùng dữ liệu thật hay vẫn là dữ liệu demo?",
      answer: "Catalog sản phẩm, người dùng nội bộ và bảng tổng quan admin đang lấy từ PostgreSQL. Một số khu demo như chat hoặc kanban vẫn chỉ mang tính tham khảo nội bộ."
    },
    {
      question: "Nếu khách chọn ship mã hoặc ship đĩa cứng thì hệ thống xử lý thế nào?",
      answer: "Giỏ hàng hiện bắt buộc nhập địa chỉ giao hàng khi chọn hình thức ship. Sau khi thanh toán mô phỏng, modal thành công sẽ giữ lại đầy đủ thông tin bàn giao để đội vận hành xử lý tiếp."
    },
    {
      question: "Gói theo năm có được nhắc gia hạn không?",
      answer: "Có. Các gói như Microsoft 365 Personal được đánh dấu thời hạn 12 tháng và thông báo rằng hệ thống sẽ gửi email nhắc gia hạn trước ngày hết hạn."
    },
    {
      question: "Tôi có thể gửi yêu cầu hỗ trợ ngay trên trang web không?",
      answer: "Có. Trang hỗ trợ hiện đã gọi API thật và lưu yêu cầu vào cơ sở dữ liệu thay vì chỉ đổi trạng thái trên giao diện."
    }
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Câu hỏi thường gặp</h2>
          <p>Tập trung vào các vấn đề khách hàng và đội vận hành quan tâm khi dùng storefront và khu quản trị WinKey.</p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className={styles.faqItem}>
                <div className={styles.faqHeader} onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                <div className={`${styles.faqContent} ${isOpen ? styles.faqContentOpen : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
