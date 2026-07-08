# Task 01 — Fix Order API & Customer Linkage

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Backend | P0 | Không | 2–3 giờ |

## Mục tiêu

Sửa các lỗi logic cơ bản làm gãy luồng đặt hàng: import sai, guest checkout không tạo customer, CartDrawer bỏ qua response từ API. Sau task này, mọi đơn hàng (dù guest hay logged-in) đều được liên kết đúng với bản ghi `customers` trong DB.

## Hiện trạng & Vấn đề

| File | Dòng | Vấn đề |
|------|------|--------|
| `src/app/api/orders/route.ts` | 1 | `import ... from 'next/response'` — module không tồn tại, phải là `'next/server'` |
| `src/app/api/orders/route.ts` | 14–20 | Chỉ lookup customer bằng email; nếu không tìm thấy, `customerId` = null và không tạo mới → guest orders không bao giờ có `customer_id` |
| `src/app/components/CartDrawer.tsx` | ~158 | `await fetch('/api/orders', ...)` nhưng không đọc response body → không lấy được `orderId`, không hiển thị trạng thái, không redirect đến trang thanh toán |
| `src/app/(public)/tai-khoan/layout.tsx` | — | Tạo customer theo `clerk_id` khi user đăng nhập, nhưng POST order không truyền `clerk_id` → customer created tách biệt khỏi orders của guest |

## Việc cần làm

- [ ] **01.1** Sửa import trong `src/app/api/orders/route.ts`: `'next/response'` → `'next/server'`
- [ ] **01.2** Trong POST `/api/orders`: nếu `customer.email` tìm không thấy trong bảng `customers`, **tạo mới** bản ghi với `email`, `first_name`, `last_name` từ body; nếu request có `clerk_id` (user đã đăng nhập), upsert theo `clerk_id` trước rồi mới theo email.
- [ ] **01.3** Thêm `GET /api/orders` (admin, yêu cầu auth — xem task 02) và `GET /api/orders/[id]` (public với order token hoặc auth user là chủ đơn).
- [ ] **01.4** Trong `CartDrawer.tsx`: đọc response JSON từ POST `/api/orders`, lưu `orderId` vào state; sau đó redirect hoặc hiển thị màn hình tiếp theo (xem task 05 cho QR flow); hiển thị toast lỗi nếu API trả lỗi.
- [ ] **01.5** Thêm `export const dynamic = 'force-dynamic'` vào route nếu cần (tránh static caching).
- [ ] **01.6** Chạy `npm run lint` và sửa hết cảnh báo.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/api/orders/route.ts` |
| SỬA | `src/app/components/CartDrawer.tsx` |
| TẠO MỚI | `src/app/api/orders/[id]/route.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] `npm run dev` chạy không lỗi build
- [ ] POST `/api/orders` trả `{ success: true, orderId: <number> }` với HTTP 201
- [ ] Guest checkout (không đăng nhập) tạo bản ghi `customers` mới trong DB
- [ ] Logged-in user checkout: bản ghi `customers` được upsert theo `clerk_id`
- [ ] CartDrawer nhận `orderId` từ response và không throw uncaught exception
- [ ] GET `/api/orders/[id]` trả thông tin đơn hàng đúng hoặc 404

## Cách kiểm thử

1. Chạy `npm run dev`.
2. Không đăng nhập, thêm sản phẩm vào giỏ, điền thông tin và đặt hàng.
3. Kiểm tra DB: `SELECT * FROM customers ORDER BY created_at DESC LIMIT 1;` — phải có bản ghi mới với email vừa điền.
4. Kiểm tra DB: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;` — `customer_id` phải khác null.
5. Đăng nhập bằng Clerk, đặt hàng, kiểm tra `customers.clerk_id` được gán đúng.
6. GET `http://localhost:3000/api/orders/<orderId>` — trả JSON hợp lệ.
