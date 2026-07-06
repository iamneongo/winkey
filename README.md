# WinKey

Ứng dụng Next.js cho storefront và khu quản trị WinKey. Dự án hiện ưu tiên luồng `core production`: catalog sản phẩm, giỏ hàng, trang hỗ trợ khách hàng, upload ảnh sản phẩm, dữ liệu thật từ PostgreSQL và route quản trị chuẩn `/admin/*`.

## Yêu cầu môi trường

- Node.js 20+
- PostgreSQL hoặc Neon
- Clerk cho đăng nhập khu quản trị

Tạo file `.env.local` từ `.env.example` và điền tối thiểu:

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
```

## Chạy local

```bash
npm install
npm run dev
```

Mở:

- Storefront: [http://localhost:3000](http://localhost:3000)
- Cửa hàng: [http://localhost:3000/cua-hang](http://localhost:3000/cua-hang)
- Hỗ trợ: [http://localhost:3000/ho-tro](http://localhost:3000/ho-tro)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Kiến trúc hiện tại

- `src/lib/catalog.ts`
  Lớp dữ liệu chính cho sản phẩm, người dùng, dashboard overview và ticket hỗ trợ.
- `src/app/api/*`
  Route Handlers cho products, users, uploads và support.
- `src/app/(public)/*`
  Storefront WinKey.
- `src/app/admin/*`
  URL chuẩn cho khu quản trị.
- `src/app/dashboard/*`
  Giữ lại để tái sử dụng page/layout cũ và redirect sang `/admin` khi cần.

## Trạng thái tính năng

- Sản phẩm storefront lấy dữ liệu thật từ DB.
- Admin sản phẩm/người dùng dùng API thật.
- Upload ảnh sản phẩm có thay ảnh và xóa ảnh cũ.
- Form hỗ trợ khách hàng lưu ticket thật vào PostgreSQL.
- Checkout hiện là luồng mô phỏng có cấu trúc dữ liệu sẵn để nối backend đơn hàng sau.

## Lưu ý triển khai

- Khu quản trị yêu cầu Clerk. Nếu thiếu key, ứng dụng sẽ hiển thị thông báo cấu hình thay vì lỗi mơ hồ.
- Route chuẩn cho admin là `/admin/*`.
- Khi deploy Vercel, chỉ cần đảm bảo đủ biến môi trường và quyền truy cập PostgreSQL.
