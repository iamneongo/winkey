# Task 07 — License Key Inventory

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Payment | P0 | Task 01, Task 06 | 3 giờ |

## Mục tiêu

Tạo kho license key trong DB, cho phép admin nhập key, và tự động cấp phát key cho khách sau khi thanh toán thành công (được gọi từ IPN handler Task 06).

## Hiện trạng & Vấn đề

- Không có bảng `license_keys`.
- Sau thanh toán, khách không nhận được key nào — đây là sản phẩm cốt lõi của website.
- Admin không có giao diện nhập kho key.

## Schema DB

```sql
CREATE TABLE IF NOT EXISTS license_keys (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  key_value TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available',  -- available | used | revoked
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Thêm cột `license_key_id` vào bảng `orders`:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS license_key_id INTEGER REFERENCES license_keys(id) ON DELETE SET NULL;
```

## Việc cần làm

- [ ] **07.1** Thêm migration `license_keys` + cột `orders.license_key_id` vào `ensureDatabaseReady`.

- [ ] **07.2** Tạo data layer functions trong `src/lib/catalog.ts`:
  - `assignLicenseKey(orderId, productId): Promise<string | null>` — tìm key available cho product, update status='used', gán order_id, trả về key_value. Phải dùng `SELECT ... FOR UPDATE SKIP LOCKED` để tránh race condition.
  - `getLicenseKeyForOrder(orderId): Promise<string | null>`
  - `addLicenseKeys(productId, keys: string[]): Promise<number>` — bulk insert

- [ ] **07.3** Tạo Admin UI để nhập kho key: thêm section trong `/admin/product/[id]` (hoặc trang riêng `/admin/keys`):
  - Textarea nhập nhiều key (mỗi dòng 1 key)
  - Submit gọi `POST /api/admin/license-keys`
  - Hiển thị số key còn lại (available count) cho từng sản phẩm

- [ ] **07.4** Tạo `POST /api/admin/license-keys` (yêu cầu admin auth):
  - Body: `{ productId: number, keys: string[] }`
  - Gọi `addLicenseKeys(productId, keys)`
  - Trả số key đã thêm thành công (bỏ qua duplicate)

- [ ] **07.5** Cập nhật IPN handler (Task 06, bước 7): gọi `assignLicenseKey(orderId, productId)` và lưu kết quả.

  > **Lưu ý**: Nếu đơn hàng có nhiều sản phẩm, phải lặp qua từng item để cấp key riêng. Xem xét cấu trúc JSONB `items` trong bảng `orders`.

- [ ] **07.6** Hiển thị license key trong `GET /api/orders/[id]` (chỉ khi `payment_status = 'paid'`).

- [ ] **07.7** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/lib/catalog.ts` — migration + data functions |
| TẠO MỚI | `src/app/api/admin/license-keys/route.ts` |
| SỬA | `src/app/admin/product/[id]/page.tsx` — thêm key management UI |
| SỬA | `src/app/api/payment/ipn/route.ts` — gọi assignLicenseKey |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Admin có thể nhập 10 key cho một sản phẩm qua UI
- [ ] Sau IPN thành công: `SELECT license_key_id FROM orders WHERE id = X` không null
- [ ] `SELECT status FROM license_keys WHERE id = Y` = 'used'
- [ ] `assignLicenseKey` chạy concurrent (2 request cùng lúc) không cấp cùng 1 key (test với `SKIP LOCKED`)
- [ ] Nếu không còn key available: IPN vẫn hoàn thành (order = paid) nhưng log cảnh báo; admin nhận notification (console.error hoặc task 17)

## Cách kiểm thử

```sql
-- Thêm key test:
INSERT INTO license_keys (product_id, key_value) VALUES (1, 'TEST-XXXX-YYYY-ZZZZ');

-- Sau IPN:
SELECT lk.key_value, lk.status, o.payment_status
FROM orders o
JOIN license_keys lk ON lk.id = o.license_key_id
WHERE o.id = <orderId>;
-- Expected: key_value = 'TEST-XXXX-YYYY-ZZZZ', status = 'used', payment_status = 'paid'
```
