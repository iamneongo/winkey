# Task 05 — Checkout QR Flow UI

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Payment | P0 | Task 01, Task 04 | 3–4 giờ |

## Mục tiêu

Thay thế toàn bộ flow checkout mock hiện tại trong `CartDrawer.tsx` bằng luồng thanh toán QR VietQR thật: hiển thị mã QR OnePay, polling trạng thái, và xử lý các trường hợp thành công/lỗi/timeout.

## Hiện trạng & Vấn đề

- `CartDrawer.tsx`: Sau khi POST `/api/orders`, code bỏ qua response, không có bước nào hiển thị QR hay chờ thanh toán.
- Không có màn hình "Đang chờ thanh toán".
- Không có cơ chế polling trạng thái đơn hàng.
- Không có trang confirmation sau khi thanh toán thành công.

## Luồng mới (UI States)

```
[Giỏ hàng] → [Form thông tin] → [Đặt hàng]
     ↓
[Tạo order (POST /api/orders)]  
     ↓ orderId
[Tạo invoice (POST /api/payment/create-invoice)]
     ↓ qrImage, amount
[QR Screen: hiển thị QR + thông tin chuyển khoản]
     ↓ polling GET /api/orders/{id} mỗi 5s
[Paid] → [Success Screen: "Cảm ơn! Xem đơn hàng →"]
[Timeout 15 phút] → ["Đã hết giờ, đơn hàng vẫn được giữ. Liên hệ hỗ trợ."]
```

## Việc cần làm

- [ ] **05.1** Tạo component `src/app/components/QRPaymentScreen.tsx` (Client Component):
  - Props: `{ qrImage: string, amount: number, orderId: number, onSuccess: () => void, onTimeout: () => void }`
  - Hiển thị: ảnh QR (base64), số tiền format VND, thông tin chuyển khoản (ngân hàng, số VA).
  - Countdown timer 15 phút (900 giây).
  - Polling: `useEffect` gọi `GET /api/orders/{orderId}` mỗi 5 giây; nếu `payment_status === 'paid'` → gọi `onSuccess`.
  - Nút "Hủy thanh toán" → confirm dialog → xóa khỏi drawer.
  - Thiết kế theo Shadcn/ui: dùng `Card`, `Badge`, `Button`, `Progress` (countdown bar).

- [ ] **05.2** Cập nhật `CartDrawer.tsx`:
  - State machine: `'cart' | 'form' | 'processing' | 'qr' | 'success' | 'error'`
  - Bước `'form'`: validate form (tên, email, số điện thoại bắt buộc).
  - Bước `'processing'`: hiển thị spinner trong khi gọi `/api/orders` và `/api/payment/create-invoice`.
  - Bước `'qr'`: render `<QRPaymentScreen />`.
  - Bước `'success'`: hiển thị thông báo thành công + link `/tai-khoan/don-hang`.

- [ ] **05.3** Tạo trang `/tai-khoan/don-hang/[id]/page.tsx` (stub): xem task 13, nhưng cần có route tồn tại để link không bị 404.

- [ ] **05.4** Đảm bảo UX mobile: QR không bị crop trên màn hình nhỏ; drawer scrollable.

- [ ] **05.5** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/components/QRPaymentScreen.tsx` |
| SỬA | `src/app/components/CartDrawer.tsx` |
| TẠO MỚI (stub) | `src/app/(public)/tai-khoan/don-hang/[id]/page.tsx` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Flow hoàn chỉnh không bị lỗi console từ bước "Đặt hàng" đến "QR hiển thị"
- [ ] QR image hiển thị (base64 PNG) trong vòng 3 giây sau khi đặt hàng
- [ ] Countdown hiển thị đúng và tự dừng khi `paid`
- [ ] Khi giả lập order chuyển sang `paid` trong DB, drawer chuyển sang màn hình success trong vòng 5–10 giây (chu kỳ poll)
- [ ] `npm run lint` và không có TypeScript error

## Cách kiểm thử

1. Mở trang chủ, thêm sản phẩm, mở giỏ.
2. Điền thông tin form, nhấn "Đặt hàng".
3. Quan sát: spinner → QR xuất hiện.
4. Kiểm tra console DevTools: không có unhandled error.
5. Giả lập thanh toán: `UPDATE orders SET payment_status = 'paid' WHERE id = <id>;`
6. Sau ≤10 giây, drawer phải hiển thị màn hình thành công.
