# Task 08 — Admin Orders Management

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Admin | P1 | Task 01, Task 06, Task 07 | 3 giờ |

## Mục tiêu

Nâng cấp `/admin/orders` từ danh sách read-only thành giao diện quản lý đầy đủ: xem chi tiết đơn, lọc/tìm kiếm, phân trang, thay đổi trạng thái, xem license key và hoa hồng liên quan.

## Hiện trạng & Vấn đề

- `src/app/admin/orders/page.tsx`: Chỉ liệt kê đơn hàng, không có chi tiết, không lọc, không phân trang.
- Không có route `/admin/orders/[id]`.
- Không thể thay đổi trạng thái đơn từ admin.

## Việc cần làm

- [ ] **08.1** Nâng cấp `src/app/admin/orders/page.tsx`:
  - Thêm filter bar: lọc theo `payment_status` (pending/paid/failed), tìm theo email hoặc order ID.
  - Phân trang: 20 đơn/trang, dùng `searchParams.page`.
  - Mỗi row có nút "Xem chi tiết" → `/admin/orders/[id]`.
  - Hiển thị cột: ID, khách hàng, tổng tiền, payment_status, created_at, affiliate (nếu có).

- [ ] **08.2** Tạo `src/app/admin/orders/[id]/page.tsx` (Server Component):
  - Query chi tiết order JOIN customers, affiliates, license_keys, commissions.
  - Hiển thị:
    - Thông tin khách hàng
    - Items đã mua (từ JSONB `items`)
    - License key đã cấp (hoặc "Chưa có")
    - Trạng thái thanh toán + thời gian
    - Hoa hồng affiliate (nếu có)
    - Timeline sự kiện (order created → paid → key assigned)

- [ ] **08.3** Tạo Client Component cho việc thay đổi trạng thái đơn (dùng Server Action hoặc API):
  - Dropdown thay đổi `payment_status` (chỉ admin)
  - Dùng `useTransition` + `router.refresh()` sau khi cập nhật

- [ ] **08.4** Thêm data functions trong `src/lib/catalog.ts`:
  - `getOrdersPaginated({ page, limit, status, query })`
  - `getOrderById(id)` — trả đầy đủ thông tin join

- [ ] **08.5** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/admin/orders/page.tsx` |
| TẠO MỚI | `src/app/admin/orders/[id]/page.tsx` |
| TẠO MỚI | `src/app/admin/orders/[id]/status-select.tsx` (Client Component) |
| SỬA | `src/lib/catalog.ts` — thêm getOrdersPaginated, getOrderById |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Lọc theo status hoạt động (URL param `?status=paid`)
- [ ] Phân trang hoạt động (URL param `?page=2`)
- [ ] Trang `/admin/orders/[id]` hiển thị license key nếu đã paid
- [ ] Admin có thể thay đổi `payment_status` → DB được cập nhật ngay

## Cách kiểm thử

1. Truy cập `/admin/orders?status=paid` → chỉ thấy đơn paid.
2. Nhấn vào một đơn → xem chi tiết có license key.
3. Thay đổi trạng thái → refresh → trạng thái mới hiển thị.
