# Task 04 — OnePay Create VA + Invoice

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Payment | P0 | Task 01, Task 03 | 3 giờ |

## Mục tiêu

Khi khách hàng nhấn "Thanh toán" trong giỏ hàng, hệ thống tạo Virtual Account + Invoice trên OnePay, lưu các reference vào bảng `orders` trong DB, và trả QR image (base64) cho frontend hiển thị.

## Hiện trạng & Vấn đề

- Không có endpoint tạo VA/Invoice OnePay.
- Bảng `orders` thiếu các cột: `payment_provider`, `onepay_user_reference`, `onepay_user_id`, `onepay_invoice_reference`, `onepay_invoice_id`, `payment_status`.
- Chưa có bảng `payment_transactions` để chống double-IPN.

## Schema DB cần thêm (migration trong `ensureDatabaseReady`)

```sql
-- Thêm vào bảng orders (ALTER TABLE nếu đã tồn tại):
payment_provider TEXT DEFAULT 'onepay',
onepay_user_reference TEXT,
onepay_user_id TEXT,
onepay_invoice_reference TEXT,
onepay_invoice_id TEXT,
payment_status TEXT NOT NULL DEFAULT 'pending',
-- payment_status: pending | paid | failed | refunded

-- Bảng mới:
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  fund_transfer_id TEXT UNIQUE NOT NULL,  -- chống double-IPN
  bank_txn_ref TEXT,
  amount NUMERIC(12,2) NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Việc cần làm

- [ ] **04.1** Cập nhật `ensureDatabaseReady` trong `src/lib/catalog.ts` (hoặc `src/lib/db.ts`): thêm migration ALTER TABLE orders + CREATE TABLE payment_transactions.

- [ ] **04.2** Tạo API route `POST /api/payment/create-invoice` (`src/app/api/payment/create-invoice/route.ts`):
  - Nhận body: `{ orderId: number }` (order phải tồn tại và `payment_status = 'pending'`)
  - Tạo `user_reference` = `"WK-ORD-{orderId}-{timestamp}"` (unique)
  - Tạo `invoice_reference` = `"INV-{orderId}-{timestamp}"`
  - Gọi `onePayClient.createUserAndInvoice(userRef, invoiceRef, totalAmount, description)`
  - Lưu `onepay_user_reference`, `onepay_user_id`, `onepay_invoice_reference`, `onepay_invoice_id` vào `orders`
  - Trả response: `{ qrImage: string (base64 PNG), invoiceId, userReference, amount }`

- [ ] **04.3** Xử lý idempotency: nếu order đã có `onepay_invoice_id`, trả lại QR cũ thay vì tạo mới (poll status trước).

- [ ] **04.4** Xử lý lỗi OnePay API: log chi tiết, trả 502 cho client với message "Không thể tạo thanh toán, vui lòng thử lại".

- [ ] **04.5** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/api/payment/create-invoice/route.ts` |
| SỬA | `src/lib/catalog.ts` — thêm migration DB |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] POST `/api/payment/create-invoice` với `orderId` hợp lệ → HTTP 200 + `qrImage` là base64 string không rỗng
- [ ] DB: bảng `orders` có cột `onepay_invoice_id` được điền sau khi gọi API
- [ ] Gọi lại lần 2 với cùng `orderId` → không tạo invoice mới trên OnePay (idempotent)
- [ ] Không có OnePay credentials nào lộ trong response hay log public

## Cách kiểm thử

```bash
# 1. Tạo order trước (qua POST /api/orders)
ORDER_ID=<orderId từ bước trên>

# 2. Tạo invoice
curl -X POST http://localhost:3000/api/payment/create-invoice \
  -H "Content-Type: application/json" \
  -d "{\"orderId\": $ORDER_ID}"

# 3. Kiểm tra response có qrImage
# 4. Kiểm tra DB: SELECT onepay_invoice_id FROM orders WHERE id = $ORDER_ID
```
