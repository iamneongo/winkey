# WinKey

Ứng dụng Next.js cho storefront và khu quản trị WinKey. Dự án hiện ưu tiên luồng `core production`: catalog sản phẩm, giỏ hàng, hỗ trợ khách hàng, upload ảnh sản phẩm, dữ liệu thật từ PostgreSQL và route quản trị chuẩn `/admin/*`.

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

## Triển khai Vercel

Trong `Project Settings -> Environment Variables`, cần khai báo:

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_APP_URL=https://ten-mien-cua-ban.vercel.app
```

Lưu ý:

- `DATABASE_URL` là biến bắt buộc nếu muốn admin, API và dữ liệu thật hoạt động trên Vercel.
- Nếu thiếu `DATABASE_URL`, storefront và overview sẽ dùng dữ liệu dự phòng để build không fail, nhưng backend admin/API sẽ chưa hoạt động đúng cho tới khi bạn thêm biến môi trường.
- Nếu thiếu Clerk key, khu admin sẽ hiện cảnh báo cấu hình thay vì lỗi mơ hồ.

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

- Sản phẩm storefront lấy dữ liệu thật từ DB khi có kết nối.
- Admin sản phẩm/người dùng dùng API thật.
- Upload ảnh sản phẩm có thay ảnh và xóa ảnh cũ.
- Form hỗ trợ khách hàng lưu ticket thật vào PostgreSQL.
- Checkout hiện là luồng mô phỏng có cấu trúc dữ liệu sẵn để nối backend đơn hàng sau.
