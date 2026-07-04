import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WinKey.vn - Mua Bán Key Bản Quyền Windows & Office Giá Rẻ Chính Hãng",
  description: "Cửa hàng bán key bản quyền Windows 11 Pro, Windows 10, Office 2021 chính hãng Microsoft. Kích hoạt online, bảo hành trọn đời máy, giao key tự động trong 3 phút.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
