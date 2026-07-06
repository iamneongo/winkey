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
      role: "Kỹ thuật viên máy tính",
      text: "Mình cần bộ Windows 11 Pro để bàn giao cho khách doanh nghiệp. Giá hiển thị trên web khớp với admin, ảnh sản phẩm rõ ràng và thao tác thêm vào giỏ hàng rất nhanh.",
      avatarLetter: "H",
      rating: 5
    },
    {
      name: "Trần Lan Anh",
      role: "Nhân viên văn phòng",
      text: "Điểm mình thích nhất là form hỗ trợ mới đã gửi yêu cầu thật, không còn kiểu bấm xong mà không biết hệ thống có ghi nhận hay chưa.",
      avatarLetter: "A",
      rating: 5
    },
    {
      name: "Phạm Minh Hoàng",
      role: "Quản trị vận hành",
      text: "Sidebar admin, bảng sản phẩm và luồng upload ảnh giờ đồng nhất hơn. Việc thay ảnh cũ khi upload ảnh mới giúp quản lý catalog gọn hơn hẳn.",
      avatarLetter: "H",
      rating: 5
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Góc nhìn từ người dùng thực tế</h2>
          <p>Những phản hồi dưới đây phản ánh đúng các luồng mà WinKey đang ưu tiên hoàn thiện trong giai đoạn hiện tại.</p>
        </div>

        <div className={styles.testiGrid}>
          {testimonials.map((testi) => (
            <div key={testi.name} className={`glass ${styles.testiCard}`}>
              <div className={styles.rating} style={{ marginBottom: "12px" }}>
                <div className={styles.ratingStars}>
                  {[...Array(testi.rating)].map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" stroke="currentColor" />
                  ))}
                </div>
              </div>
              <p className={styles.testiBody}>{testi.text}</p>
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
