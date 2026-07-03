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
      question: "Key Retail là gì? Tôi có thể kích hoạt lại sau khi cài lại Windows không?",
      answer: "Key Retail là phiên bản thương mại bán lẻ chính hãng cao cấp nhất của Microsoft. Bạn hoàn toàn có thể kích hoạt lại trên chính máy tính đó sau khi cài lại hệ điều hành Windows mà không lo bị mất bản quyền."
    },
    {
      question: "Chính sách bảo hành và hỗ trợ kỹ thuật tại WinKey như thế nào?",
      answer: "Chúng tôi bảo hành 1 đổi 1 trọn đời theo máy tính của bạn. Nếu key phát sinh lỗi kích hoạt hoặc bị nhả bản quyền do lỗi hệ thống, chúng tôi sẽ cấp key mới ngay lập tức. Hỗ trợ kỹ thuật qua Ultraview/Teamview miễn phí 24/7."
    },
    {
      question: "Sau khi đặt hàng thì bao lâu tôi sẽ nhận được key?",
      answer: "Hệ thống của chúng tôi xử lý đơn hàng tự động. Bạn sẽ nhận được mã kích hoạt (Product Key) kèm hướng dẫn chi tiết qua Email và số điện thoại đăng ký chỉ trong vòng 1 đến 3 phút sau khi thanh toán."
    },
    {
      question: "Tôi có được cập nhật Windows Update chính thức từ Microsoft không?",
      answer: "Có, hệ điều hành được kích hoạt bằng key bản quyền của chúng tôi sẽ được cập nhật tất cả các bản vá bảo mật, tính năng mới chính thức trực tiếp từ máy chủ Microsoft Update trọn đời."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Câu Hỏi Thường Gặp</h2>
          <p>Giải đáp nhanh những thắc mắc phổ biến của khách hàng về key bản quyền Windows & Office.</p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <div className={styles.faqHeader} onClick={() => toggleFaq(idx)}>
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
