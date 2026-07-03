"use client";

import React from "react";
import { Star } from "lucide-react";
import styles from "./components.module.css";

interface TestiItem {
  name: string;
  role: string;
  text: string;
  avatarLetter: string;
  rating: number;
}

export const Testimonials: React.FC = () => {
  const testimonials: TestiItem[] = [
    {
      name: "Nguyễn Văn Hùng",
      role: "Lập trình viên Fullstack",
      text: "Đã mua combo Win 11 Pro + Office 2021 ở đây. Nhận key siêu nhanh qua mail, nhập phát ăn ngay. Rất hài lòng với dịch vụ hỗ trợ qua Zalo nhiệt tình.",
      avatarLetter: "H",
      rating: 5
    },
    {
      name: "Trần Thị Lan Anh",
      role: "Nhân viên văn phòng",
      text: "Máy tính báo hết hạn bản quyền Office làm mình không làm việc được. May mắn được shop hỗ trợ kích hoạt từ xa trong 5 phút. Cảm ơn shop rất nhiều!",
      avatarLetter: "A",
      rating: 5
    },
    {
      name: "Phạm Minh Hoàng",
      role: "Thiết kế đồ họa",
      text: "Dùng Win crack suốt ngày bị lỗi và dính virus. Chuyển sang key bản quyền ở đây chạy ổn định hẳn, cập nhật Windows thoải mái. Giá cả quá hợp lý.",
      avatarLetter: "H",
      rating: 5
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p>Hơn 10,000+ cá nhân và doanh nghiệp đã hài lòng với dịch vụ cung cấp key bản quyền của WinKey.</p>
        </div>

        <div className={styles.testiGrid}>
          {testimonials.map((testi, idx) => (
            <div key={idx} className={`glass ${styles.testiCard}`}>
              <div className={styles.rating} style={{ marginBottom: "12px" }}>
                <div className={styles.ratingStars}>
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="currentColor" />
                  ))}
                </div>
              </div>
              <p className={styles.testiBody}>"{testi.text}"</p>
              <div className={styles.testiUser}>
                <div className={styles.avatar}>{testi.avatarLetter}</div>
                <div>
                  <div className={styles.userName}>{testi.name}</div>
                  <div className={styles.userRole}>{testi.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
