# Task 02 — API Auth Hardening

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Backend | P0 | Task 01 | 2 giờ |

## Mục tiêu

Bảo vệ tất cả API endpoint có khả năng ghi dữ liệu. Hiện tại các endpoint này đều public, bất kỳ ai cũng có thể gọi mà không cần xác thực. Sau task này, mọi thao tác ghi/xóa admin đều yêu cầu Clerk session; POST order của guest vẫn public nhưng được validate schema bằng Zod.

## Hiện trạng & Vấn đề

- `/api/products` (PUT, DELETE): Bất kỳ ai cũng có thể sửa/xóa sản phẩm.
- `/api/orders` (GET danh sách): Lộ toàn bộ đơn hàng khách hàng.
- `/api/uploads` (POST): Bất kỳ ai cũng có thể upload file lên server.
- `/api/users` nếu có: Tương tự.
- Không có Zod validation trên bất kỳ request body nào → dễ bị inject dữ liệu rác.

## Việc cần làm

- [ ] **02.1** Tạo helper `src/lib/api-auth.ts` export hàm `requireAdmin()`: dùng `auth()` của Clerk; kiểm tra `orgRole === 'org:admin'`; nếu không, throw/return `NextResponse.json({error:'Unauthorized'}, {status:401})`.
- [ ] **02.2** Tạo `src/lib/api-schemas.ts` với Zod schemas:
  - `orderCreateSchema` — validate body POST `/api/orders` (customer object, items array, total number, referral_code optional string)
  - `productSchema` — validate body PUT `/api/products/[id]`
  - `blogSchema` — validate body POST/PUT `/api/blogs`
- [ ] **02.3** Áp dụng `requireAdmin()` cho:
  - `GET /api/orders` (danh sách tất cả đơn)
  - `PUT /api/products/[id]`, `DELETE /api/products/[id]`
  - `POST /api/uploads`, `DELETE /api/uploads/[...]`
  - `GET /api/users` nếu tồn tại
- [ ] **02.4** POST `/api/orders` giữ public nhưng thêm Zod parse; trả `400` với danh sách lỗi nếu body invalid.
- [ ] **02.5** Xem xét thêm rate-limiting đơn giản (optional, dùng header `x-forwarded-for` + in-memory map) cho POST `/api/orders`.
- [ ] **02.6** Cập nhật `src/middleware.ts`: đảm bảo các route `/api/` (trừ whitelist public) đều đi qua Clerk middleware.
- [ ] **02.7** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/lib/api-auth.ts` |
| TẠO MỚI | `src/lib/api-schemas.ts` |
| SỬA | `src/app/api/orders/route.ts` |
| SỬA | `src/app/api/products/[id]/route.ts` (hoặc tương đương) |
| SỬA | `src/app/api/uploads/route.ts` |
| SỬA | `src/middleware.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] `DELETE /api/products/<id>` không có auth → HTTP 401
- [ ] `GET /api/orders` không có auth → HTTP 401
- [ ] POST `/api/orders` với body thiếu field → HTTP 400 + danh sách lỗi Zod
- [ ] Admin đăng nhập vào `/admin` → mọi API admin đều hoạt động bình thường
- [ ] `npm run lint` sạch

## Cách kiểm thử

```bash
# Không auth → 401
curl -X DELETE http://localhost:3000/api/products/1
curl http://localhost:3000/api/orders

# Body thiếu → 400
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"total": 100}'

# Admin auth → hoạt động (dùng cookie session từ browser DevTools)
```
