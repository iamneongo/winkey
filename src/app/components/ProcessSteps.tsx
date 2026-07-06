"use client";

import React from "react";
import styles from "./components.module.css";

export const ProcessSteps: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Chọn sản phẩm",
      desc: "Xem catalog theo nhóm Windows, Office hoặc combo, đối chiếu mô tả và hình thức bàn giao phù hợp."
    },
    {
      num: "02",
      title: "Gửi thông tin nhận đơn",
      desc: "Khách nhập email, số điện thoại và địa chỉ giao hàng nếu chọn ship mã bản quyền hoặc đĩa cứng."
    },
    {
      num: "03",
      title: "Bàn giao và hỗ trợ",
      desc: "Hệ thống tạo key mẫu cho đơn thử nghiệm, đồng thời lưu đủ dữ liệu để nối sang backend đơn hàng thật ở bước tiếp theo."
    }
  ];

  return (
    <section id="guides" className={styles.processSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Quy trình mua hàng</h2>
          <p>Website hiện đã hỗ trợ luồng nhận đơn, bàn giao key và ghi nhận thông tin khách hàng rõ ràng hơn trước.</p>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.num} className={styles.processStep}>
              <div className={styles.stepNumber}>{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
