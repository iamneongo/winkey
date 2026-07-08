# Task 09 — Admin Affiliates & Commission Management

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Admin | P1 | Task 06, Task 07 | 4 giờ |

## Mục tiêu

Nâng cấp `/admin/affiliates` thành hệ thống quản lý CTV đầy đủ: duyệt đăng ký, chỉnh tỉ lệ commission, theo dõi lịch sử hoa hồng với trạng thái pending→approved→paid, và xử lý payout.

## Hiện trạng & Vấn đề

- `/admin/affiliates` chỉ đọc danh sách, không có CRUD.
- `commissions` table thiếu cột `status` (đã thêm trong Task 06).
- Balance không được cộng từ commission (đã sửa trong Task 06).
- Không có luồng payout: admin không thể đánh dấu đã trả tiền cho CTV.

## Việc cần làm

- [ ] **09.1** Tạo Server Action file `src/app/admin/affiliates/actions.ts`:
  - `updateCommissionRate(affiliateId, rate)` — validate rate ∈ [1, 50]
  - `updateAffiliateStatus(affiliateId, status)` — active | suspended
  - `markCommissionsPaid(affiliateId)` — UPDATE commissions SET status='paid' WHERE affiliate_id = X AND status='approved'; UPDATE affiliates SET balance = 0

- [ ] **09.2** Nâng cấp `src/app/admin/affiliates/page.tsx`:
  - Mỗi row: nút "Chi tiết" + inline edit commission rate + toggle status.
  - Thống kê tổng: tổng CTV, tổng hoa hồng pending, tổng đã trả.

- [ ] **09.3** Tạo `src/app/admin/affiliates/[id]/page.tsx`:
  - Thông tin CTV: tên, email, mã giới thiệu, commission rate, balance.
  - Form sửa commission_rate (1–50%, input number + Save button).
  - Bảng lịch sử hoa hồng: order_id, amount, status (pending/approved/paid), created_at.
  - Nút "Xác nhận trả tiền" (Payout): chỉ active khi có commission status=approved; confirm dialog; gọi `markCommissionsPaid`.

- [ ] **09.4** Thêm migration `commissions.status` nếu Task 06 chưa làm (check `IF NOT EXISTS`).

- [ ] **09.5** Thêm data functions trong `src/lib/catalog.ts`:
  - `getAffiliateById(id)` — trả đầy đủ JOIN với customer
  - `getCommissionsByAffiliate(affiliateId)` — danh sách hoa hồng
  - `getAffiliatesStats()` — aggregate: count, sum pending, sum paid

- [ ] **09.6** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/admin/affiliates/actions.ts` |
| SỬA | `src/app/admin/affiliates/page.tsx` |
| TẠO MỚI | `src/app/admin/affiliates/[id]/page.tsx` |
| SỬA | `src/lib/catalog.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Admin có thể thay đổi commission rate → DB cập nhật ngay
- [ ] Admin có thể suspend một CTV → status = 'suspended'
- [ ] Trang chi tiết CTV hiển thị đúng lịch sử hoa hồng
- [ ] Nút "Payout": commissions chuyển sang 'paid', balance về 0
- [ ] `npm run lint` sạch

## Cách kiểm thử

1. Truy cập `/admin/affiliates/1`, thay đổi commission rate từ 10% → 15% → Save → reload → vẫn 15%.
2. Nhấn "Payout" → confirm → reload → balance = 0, commissions status = 'paid'.
