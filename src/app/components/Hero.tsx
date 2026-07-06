"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./components.module.css";

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!heroRef.current) return;

      gsap.from(heroRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      });
    },
    { scope: heroRef }
  );

  return (
    <section className={styles.hero} ref={heroRef} style={{ paddingBottom: "30px", paddingTop: "120px" }}>
      <div className={styles.glowSpot1} />
      <div className={styles.glowSpot2} />

      <div className={styles.container} style={{ position: "relative", zIndex: 5 }}>
        <div className={styles.heroStack} style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div className={styles.heroEyebrow}>
            <ShieldCheck size={14} />
            <span>Bản quyền Microsoft chính hãng, hỗ trợ kích hoạt rõ ràng</span>
          </div>

          <h1 className={styles.heroTitleCent}>
            Kích hoạt Windows và Office
            <br />
            chính hãng cho cá nhân và doanh nghiệp
          </h1>

          <p className={styles.heroDescCent}>
            WinKey cung cấp key Retail, gói Microsoft 365 và combo cài đặt phù hợp cho nhu cầu học tập,
            văn phòng, kỹ thuật và triển khai nội bộ. Dữ liệu sản phẩm trên website đang đồng bộ trực tiếp
            từ hệ thống quản trị.
          </p>

          <div className={styles.heroCtaGroup}>
            <Link href="/cua-hang" className="btn-grad" style={{ padding: "14px 28px" }}>
              Xem bảng giá
            </Link>
            <Link href="/huong-dan" className="btn-outline" style={{ padding: "14px 28px" }}>
              Xem hướng dẫn kích hoạt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
