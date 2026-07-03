"use client";

import React from "react";
import styles from "./components.module.css";

export const ProcessSteps: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Chọn sản phẩm",
      desc: "Lựa chọn phiên bản Windows hoặc Office phù hợp với thiết bị của bạn từ danh sách sản phẩm."
    },
    {
      num: "02",
      title: "Thanh toán an toàn",
      desc: "Tiến hành thanh toán bảo mật bằng hình thức Chuyển khoản ngân hàng hoặc ví điện tử MoMo."
    },
    {
      num: "03",
      title: "Kích hoạt tức thì",
      desc: "Hệ thống tự động gửi Product Key và hướng dẫn chi tiết qua Email/Zalo để bạn kích hoạt online ngay."
    }
  ];

  return (
    <section id="guides" className={styles.processSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Quy Trình Mua Hàng & Kích Hoạt</h2>
          <p>Sở hữu phần mềm bản quyền chính hãng chưa bao giờ đơn giản đến thế.</p>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.processStep}>
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
