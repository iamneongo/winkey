# Task 06 — OnePay IPN Webhook

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Payment | P0 | Task 03, Task 04, Task 07 | 4 giờ |

## Mục tiêu

Xây dựng endpoint IPN (Instant Payment Notification) nhận callback từ OnePay khi khách hàng chuyển khoản thành công. Endpoint phải: xác thực chữ ký OWS, đảm bảo idempotency, cập nhật trạng thái đơn hàng, cấp license key, cập nhật balance affiliate, và disable Virtual Account.

## Hiện trạng & Vấn đề

Không có endpoint IPN. OnePay không thể thông báo khi thanh toán thành công → hệ thống không biết order đã được thanh toán.

## Luồng IPN

```
OnePay → PUT /api/payment/ipn
  body: { invoice: { id, state, amount }, user: { reference }, fund_transfer_id, bank_txn_ref, ... }

1. Verify OWS signature từ header X-OP-Authorization
2. Kiểm tra fund_transfer_id trong payment_transactions → nếu đã có: return 200 {} (idempotent)
3. Tìm order theo onepay_user_reference hoặc onepay_invoice_id
4. Kiểm tra amount khớp
5. INSERT payment_transactions (fund_transfer_id, order_id, amount, bank_txn_ref, raw_payload)
6. UPDATE orders SET payment_status = 'paid', paid_at = NOW()
7. Gán license key (xem Task 07): lấy available key → gắn vào order → mark key as 'used'
8. Nếu order có affiliate_id:
   - Tính commission = total * commission_rate / 100
   - UPDATE affiliates SET balance = balance + commission
   - UPDATE commissions SET status = 'approved' WHERE order_id = ...
9. Gọi onePayClient.disableUser(userReference) — disable VA
10. (Task 17) Gửi email xác nhận + key cho khách
11. Return 200 {}
```

## Việc cần làm

- [ ] **06.1** Tạo `PUT /api/payment/ipn` (`src/app/api/payment/ipn/route.ts`):
  - Method PUT (OnePay dùng PUT cho IPN)
  - Đọc header `X-OP-Authorization`, `X-OP-Date`, `X-OP-Expires`
  - Gọi `verifySignature()` từ `src/lib/onepay/signing.ts` — nếu sai: log + return HTTP 400
  - Implement tất cả các bước logic trên trong transaction DB (`BEGIN ... COMMIT`)

- [ ] **06.2** Tạo hàm `verifySignature(request, headers): boolean` trong `src/lib/onepay/signing.ts`.

- [ ] **06.3** Thêm migration trong `ensureDatabaseReady`:
  ```sql
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
  ALTER TABLE commissions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
  -- status: pending | approved | paid
  ```

- [ ] **06.4** Đảm bảo toàn bộ bước 1–11 nằm trong DB transaction; nếu bất kỳ bước nào fail → rollback và trả HTTP 500 (OnePay sẽ retry).

- [ ] **06.5** Log chi tiết (nhưng không log secret key hay full card number):
  ```
  [IPN] received fund_transfer_id=XXX, order_id=YYY, amount=ZZZ
  [IPN] processed successfully for order YYY
  ```

- [ ] **06.6** Thêm route `/api/payment/ipn` vào danh sách **public** (không yêu cầu Clerk auth) trong `middleware.ts`, nhưng bảo vệ bằng OWS signature.

- [ ] **06.7** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/api/payment/ipn/route.ts` |
| SỬA | `src/lib/onepay/signing.ts` — thêm verifySignature |
| SỬA | `src/lib/catalog.ts` — migration commissions.status, orders.paid_at |
| SỬA | `src/middleware.ts` — whitelist IPN route |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Gửi IPN request giả với signature đúng → HTTP 200, order chuyển `paid`
- [ ] Gửi IPN lần 2 với cùng `fund_transfer_id` → HTTP 200 (idempotent, không cấp key 2 lần)
- [ ] Gửi IPN với signature sai → HTTP 400
- [ ] Sau IPN thành công: `affiliates.balance` được cộng đúng hoa hồng
- [ ] VA bị disable (kiểm tra OnePay MTF portal hoặc gọi GET user status)
- [ ] `npm run lint` sạch

## Cách kiểm thử

```bash
# Dùng tool giả lập IPN của OnePay MTF portal HOẶC:
# Tạo script sign-and-send-ipn.ts để tạo request hợp lệ:
#   1. Tạo body IPN giống format OnePay
#   2. Ký bằng signRequest()
#   3. PUT đến http://localhost:3000/api/payment/ipn (qua ngrok nếu cần)

# Kiểm tra idempotency:
curl -X PUT http://localhost:3000/api/payment/ipn \
  -H "X-OP-Authorization: ..." \
  -H "Content-Type: application/json" \
  -d '{"fund_transfer_id":"FT001",...}'
# Gửi 2 lần → lần 2 vẫn 200, DB không thay đổi
```

## Lưu ý bảo mật

- Không bao giờ `console.log(secretKey)` hay log raw header `X-OP-Authorization` đầy đủ.
- Kiểm tra `X-OP-Expires` để tránh replay attack.
- Sử dụng constant-time comparison cho signature (tránh timing attack).
