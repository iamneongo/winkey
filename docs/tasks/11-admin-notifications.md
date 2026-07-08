# Task 11 — Admin Notifications

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Admin | P1 | Task 06, Task 08 | 3 giờ |

## Mục tiêu

Thay stub `/admin/notifications` bằng hệ thống thông báo nội bộ thực tế: hiển thị thông báo tự động theo sự kiện (đơn hàng mới, đơn paid, đơn failed, CTV mới đăng ký), và cho phép admin đọc/xóa thông báo.

## Hiện trạng & Vấn đề

- `/admin/notifications` là placeholder, không có chức năng gì.
- Không có cơ chế nào thông báo cho admin khi có đơn hàng mới.

## Schema DB

```sql
CREATE TABLE IF NOT EXISTS admin_notifications (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,  -- new_order | order_paid | order_failed | new_affiliate | low_key_stock
  title TEXT NOT NULL,
  body TEXT,
  ref_id INTEGER,      -- order_id hoặc affiliate_id liên quan
  ref_type TEXT,       -- 'order' | 'affiliate'
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Việc cần làm

- [ ] **11.1** Thêm migration `admin_notifications` vào `ensureDatabaseReady`.

- [ ] **11.2** Tạo helper `src/lib/notifications.ts`:
  - `createNotification({ type, title, body, refId, refType })` — INSERT vào DB
  - `getUnreadCount(): Promise<number>`
  - `getNotifications({ limit, offset, unreadOnly })`
  - `markAsRead(id)`, `markAllAsRead()`

- [ ] **11.3** Gọi `createNotification` tại các điểm sự kiện:
  - `POST /api/orders` → type='new_order', title='Đơn hàng mới #[id]'
  - IPN handler (Task 06) khi paid → type='order_paid'
  - IPN handler khi không còn key → type='low_key_stock', body='Sản phẩm X hết key'
  - Khi customer đăng ký affiliate → type='new_affiliate'

- [ ] **11.4** Nâng cấp `src/app/admin/notifications/page.tsx`:
  - Tabs: Tất cả / Chưa đọc
  - Danh sách notification: icon theo type, title, body, timestamp, trạng thái read/unread
  - Nút "Đánh dấu tất cả đã đọc"
  - Click vào notification có `refId`: navigate đến `/admin/orders/[id]` hoặc `/admin/affiliates/[id]`
  - Phân trang

- [ ] **11.5** Hiển thị badge số thông báo chưa đọc trên sidebar admin (cần `getUnreadCount` và thêm vào layout hoặc sidebar component).

- [ ] **11.6** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/lib/notifications.ts` |
| SỬA | `src/app/admin/notifications/page.tsx` |
| SỬA | `src/app/api/orders/route.ts` — gọi createNotification |
| SỬA | `src/app/api/payment/ipn/route.ts` — gọi createNotification |
| SỬA | `src/lib/catalog.ts` — migration |
| SỬA | `src/components/layout/app-sidebar.tsx` — badge unread count |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Đặt hàng → thông báo "Đơn hàng mới" xuất hiện trong `/admin/notifications`
- [ ] Thông báo có badge "unread" cho đến khi click
- [ ] Sidebar hiển thị số đỏ (badge) khi có thông báo chưa đọc
- [ ] Click vào thông báo order → điều hướng đến `/admin/orders/[id]`

## Cách kiểm thử

1. Đặt một đơn hàng mới.
2. Vào `/admin/notifications` → thấy thông báo "Đơn hàng mới".
3. Badge sidebar hiển thị số > 0.
4. Click vào thông báo → đến trang chi tiết đơn.
5. Nhấn "Đánh dấu tất cả đã đọc" → badge biến mất.
