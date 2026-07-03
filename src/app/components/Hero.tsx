"use client";

import React, { useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./components.module.css";

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Clean, unified GSAP container entrance animation to guarantee layout visibility
  useGSAP(() => {
    if (!heroRef.current) return;
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 20,
      duration: 1.0,
      ease: "power3.out"
    });
  }, { scope: heroRef });

  return (
    <section className={styles.hero} ref={heroRef} style={{ paddingBottom: "30px", paddingTop: "120px" }}>
      {/* Background Animated Glow Spots */}
      <div className={styles.glowSpot1} />
      <div className={styles.glowSpot2} />

      <div className={styles.container} style={{ position: "relative", zIndex: 5 }}>
        <div className={styles.heroStack} style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Eyebrow / Trust badge */}
          <div className={styles.heroEyebrow}>
            <ShieldCheck size={14} />
            <span>Bản quyền chính hãng Microsoft 100%</span>
          </div>

          {/* Title */}
          <h1 className={styles.heroTitleCent}>
            Kích Hoạt Windows & Office <br />
            Bản Quyền Vĩnh Viễn
          </h1>

          {/* Subtext */}
          <p className={styles.heroDescCent}>
            Kích hoạt trực tuyến siêu tốc trực tiếp qua máy chủ Microsoft. Nhận đầy đủ bản vá bảo mật và hỗ trợ kỹ thuật cài đặt trọn đời máy miễn phí.
          </p>

          {/* CTA Actions */}
          <div className={styles.heroCtaGroup}>
            <a href="#store" className="btn-grad" style={{ padding: "14px 28px" }}>
              Xem Bảng Giá Bản Quyền
            </a>
            <a href="#guides" className="btn-outline" style={{ padding: "14px 28px" }}>
              Hướng Dẫn Kích Hoạt
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
