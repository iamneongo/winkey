# Task 14 — Affiliate Dashboard Enhancements

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Customer UI | P1 | Task 06, Task 09 | 3 giờ |

## Mục tiêu

Hoàn thiện trang `/tai-khoan/affiliate` dành cho Cộng tác viên: đăng ký trở thành CTV, xem mã giới thiệu, thống kê thu nhập, lịch sử hoa hồng theo từng đơn hàng, và form yêu cầu rút tiền.

## Hiện trạng & Vấn đề

- Trang affiliate hiện tại không có lịch sử hoa hồng chi tiết.
- Không có thống kê (tổng đã kiếm, đang chờ, đã được trả).
- Không có form rút tiền / yêu cầu payout.
- Nếu chưa đăng ký làm CTV, không có hướng dẫn rõ ràng.

## Việc cần làm

- [ ] **14.1** State "Chưa là CTV":
  - Hiển thị trang giới thiệu chương trình affiliate: lợi ích, tỉ lệ commission mặc định.
  - Nút "Đăng ký làm Cộng tác viên" → gọi Server Action `registerAffiliate()`:
    - Tạo bản ghi `customers` nếu chưa có (upsert theo clerk_id)
    - INSERT vào `affiliates` với `referral_code` ngẫu nhiên (format: `WK-{6 ký tự uppercase alphanumeric}`)
    - Kiểm tra unique code trước khi insert

- [ ] **14.2** State "Đã là CTV" — Dashboard:
  - **Thẻ thống kê**: Số dư hiện tại, Hoa hồng tháng này, Tổng đã kiếm, Tổng đã rút.
  - **Mã giới thiệu**: hiển thị rõ, nút copy link `https://winkey.vn/?ref=[code]`.
  - **Bảng lịch sử hoa hồng**: order_id, amount, status (pending/approved/paid), ngày tạo, link đơn.
  - Phân trang lịch sử: 10 dòng/trang.

- [ ] **14.3** Form yêu cầu rút tiền:
  - Chỉ hiển thị khi `balance > 0` và có commission status='approved'.
  - Fields: Ngân hàng, Số tài khoản, Tên chủ tài khoản, Ghi chú.
  - Submit → INSERT vào bảng `payout_requests` (tạo bảng mới):
    ```sql
    CREATE TABLE IF NOT EXISTS payout_requests (
      id SERIAL PRIMARY KEY,
      affiliate_id INTEGER REFERENCES affiliates(id),
      amount NUMERIC(12,2) NOT NULL,
      bank_name TEXT NOT NULL,
      bank_account TEXT NOT NULL,
      account_name TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```
  - Sau submit: toast "Yêu cầu đã gửi, admin sẽ xử lý trong 1–3 ngày làm việc."
  - Tạo notification cho admin (Task 11) type='payout_request'.

- [ ] **14.4** Thêm migration `payout_requests` vào `ensureDatabaseReady`.

- [ ] **14.5** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/(public)/tai-khoan/affiliate/page.tsx` |
| SỬA | `src/app/(public)/tai-khoan/affiliate/actions.ts` |
| SỬA | `src/lib/catalog.ts` — migration payout_requests, getAffiliateByClerkId, getCommissionHistory |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] User mới đăng nhập vào `/tai-khoan/affiliate` thấy trang giới thiệu + nút đăng ký
- [ ] Sau đăng ký: thấy dashboard với mã giới thiệu
- [ ] Link giới thiệu copy đúng format `https://winkey.vn/?ref=WK-XXXXXX`
- [ ] Lịch sử hoa hồng hiển thị đúng sau IPN xử lý
- [ ] Form payout hoạt động: tạo được bản ghi trong `payout_requests`

## Cách kiểm thử

1. Đăng nhập user chưa có affiliate → thấy trang giới thiệu → nhấn đăng ký.
2. Sau đăng ký: thấy dashboard với mã giới thiệu.
3. Copy link, mở incognito, vào trang chủ với link → mua hàng → IPN → hoa hồng xuất hiện.
4. Form payout: điền thông tin → Submit → toast xác nhận.
