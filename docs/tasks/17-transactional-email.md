# Task 17 — Transactional Email

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Integration | P2 | Task 06, Task 07 | 3–4 giờ |

## Mục tiêu

Tích hợp dịch vụ gửi email transactional (Resend ưu tiên, hoặc Nodemailer/SMTP) để tự động gửi email xác nhận đơn hàng + license key cho khách sau khi thanh toán thành công.

## Hiện trạng & Vấn đề

- Không có email nào được gửi sau khi đặt hàng hay thanh toán.
- Khách không biết license key của mình nếu quên vào tài khoản.

## Quyết định kỹ thuật

Dùng **Resend** (resend.com) — cung cấp API đơn giản, có free tier 3,000 email/tháng, hỗ trợ React Email templates.
- Cài: `npm install resend @react-email/components`
- Env mới: `RESEND_API_KEY=re_xxxxx`, `EMAIL_FROM=noreply@winkey.vn`

Nếu chủ dự án không muốn dùng Resend: dùng Nodemailer với SMTP cài thêm bước cấu hình SMTP server.

## Việc cần làm

- [ ] **17.1** Cài đặt Resend: `npm install resend @react-email/components`

- [ ] **17.2** Tạo email templates (React Email components) trong `src/emails/`:
  - `OrderConfirmationEmail.tsx`: Chào [tên], đơn hàng #[id], danh sách sản phẩm, tổng tiền, "Đang chờ thanh toán".
  - `PaymentSuccessEmail.tsx`: Thông báo thanh toán thành công, license key highlight, hướng dẫn kích hoạt ngắn.
  - `AffiliateWelcomeEmail.tsx`: Chào mừng CTV mới, mã giới thiệu, hướng dẫn chia sẻ.

- [ ] **17.3** Tạo `src/lib/email.ts`:
  - `sendOrderConfirmation(order, customer)` 
  - `sendPaymentSuccess(order, customer, licenseKey)`
  - `sendAffiliateWelcome(customer, referralCode)`
  - Mỗi hàm dùng Resend client, log lỗi nếu fail (không throw để không block luồng chính).

- [ ] **17.4** Gắn vào các điểm sự kiện:
  - `POST /api/orders` → gọi `sendOrderConfirmation` (fire-and-forget, không await)
  - IPN handler (Task 06) sau khi paid → gọi `sendPaymentSuccess`
  - `registerAffiliate` action (Task 14) → gọi `sendAffiliateWelcome`

- [ ] **17.5** Tạo preview route `/api/email-preview/[template]` (chỉ development) để xem trước email trong browser.

- [ ] **17.6** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/emails/OrderConfirmationEmail.tsx` |
| TẠO MỚI | `src/emails/PaymentSuccessEmail.tsx` |
| TẠO MỚI | `src/emails/AffiliateWelcomeEmail.tsx` |
| TẠO MỚI | `src/lib/email.ts` |
| SỬA | `src/app/api/orders/route.ts` |
| SỬA | `src/app/api/payment/ipn/route.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Đặt hàng → nhận email xác nhận trong vòng 30 giây
- [ ] IPN thanh toán thành công → nhận email với license key
- [ ] Preview template hoạt động tại `http://localhost:3000/api/email-preview/payment-success`
- [ ] Nếu Resend API lỗi → log error nhưng IPN vẫn trả 200 (không block)

## Cách kiểm thử

1. Điền email thật khi đặt hàng → kiểm tra hòm thư.
2. Trigger IPN (qua tool giả lập) → kiểm tra email có license key.
3. Resend dashboard (resend.com/emails) → thấy email đã gửi.
4. Tắt `RESEND_API_KEY` → đặt hàng → IPN vẫn hoàn thành, chỉ log lỗi.

## Lưu ý

- Không hardcode địa chỉ email người gửi — lấy từ env `EMAIL_FROM`.
- Preview route phải được disable ở production (`process.env.NODE_ENV !== 'production'`).
