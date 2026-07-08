# Task 13 — Account Profile & Orders

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Customer UI | P1 | Task 01, Task 07 | 3–4 giờ |

## Mục tiêu

Hoàn thiện khu vực tài khoản khách hàng: chỉnh sửa hồ sơ, xem danh sách đơn hàng có phân trang, xem chi tiết đơn và license key đã mua.

## Hiện trạng & Vấn đề

- `/tai-khoan`: chỉ hiển thị tên + email từ Clerk, không sửa được hồ sơ.
- `/tai-khoan/don-hang`: không có chi tiết đơn, không phân trang.
- Không có route `/tai-khoan/don-hang/[id]`.
- License key không hiển thị cho khách.

## Việc cần làm

- [ ] **13.1** Cập nhật `/tai-khoan/page.tsx` (hoặc tương đương):
  - Form sửa hồ sơ: first_name, last_name, phone (lưu vào bảng `customers`, không phải Clerk).
  - Hiển thị email (readonly, lấy từ Clerk).
  - Server Action `updateProfile(formData)`: upsert vào `customers` theo `clerk_id`.

- [ ] **13.2** Nâng cấp `/tai-khoan/don-hang/page.tsx`:
  - Lấy `userId` từ Clerk, tìm `customer_id` tương ứng.
  - Query đơn hàng của customer: `SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`.
  - Hiển thị: order ID, sản phẩm, tổng tiền, trạng thái, ngày đặt.
  - Phân trang: 10 đơn/trang.
  - Link "Xem chi tiết" → `/tai-khoan/don-hang/[id]`.

- [ ] **13.3** Tạo `/tai-khoan/don-hang/[id]/page.tsx`:
  - Kiểm tra order thuộc về user hiện tại (bảo mật: so sánh `customer_id`).
  - Hiển thị:
    - Danh sách sản phẩm (từ JSONB `items`)
    - Tổng tiền
    - Trạng thái thanh toán + ngày paid
    - **License key** (chỉ hiển thị nếu `payment_status = 'paid'`): hiển thị key rõ ràng + nút copy
    - Hướng dẫn kích hoạt ngắn gọn (hardcode theo product category)

- [ ] **13.4** Nếu customer chưa có bản ghi trong `customers` (mua hàng trước khi đăng nhập): hiển thị thông báo "Đơn hàng của bạn có thể không hiển thị nếu đặt lúc chưa đăng nhập. Liên hệ hỗ trợ với email [X]."

- [ ] **13.5** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/(public)/tai-khoan/page.tsx` |
| SỬA | `src/app/(public)/tai-khoan/don-hang/page.tsx` |
| TẠO MỚI | `src/app/(public)/tai-khoan/don-hang/[id]/page.tsx` |
| SỬA | `src/lib/catalog.ts` — getOrdersByCustomer, getOrderByIdForCustomer |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Khách đăng nhập, sửa first_name → reload → tên mới hiển thị
- [ ] `/tai-khoan/don-hang` hiển thị đúng đơn hàng của user đang đăng nhập
- [ ] `/tai-khoan/don-hang/[id]` của user khác → redirect hoặc 403
- [ ] License key hiển thị (sau khi IPN xử lý xong)
- [ ] Nút copy key hoạt động (clipboard API)

## Cách kiểm thử

1. Đăng nhập, vào `/tai-khoan`, sửa first_name → Save → reload → tên mới.
2. Đặt hàng (đã qua IPN), vào `/tai-khoan/don-hang` → thấy đơn.
3. Click vào đơn → thấy license key.
4. Thử truy cập `/tai-khoan/don-hang/[id-của-người-khác]` → phải bị từ chối.
