# Task 12 — Product Detail Page

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Customer UI | P1 | Không | 3 giờ |

## Mục tiêu

Tạo trang chi tiết sản phẩm `/cua-hang/[slug]` với đầy đủ thông tin sản phẩm, tính năng, đánh giá, nút "Mua ngay", và metadata SEO.

## Hiện trạng & Vấn đề

- Không có trang chi tiết sản phẩm. Click vào sản phẩm trên storefront hiện không dẫn đến đâu (hoặc 404).
- Không có nút "Mua ngay" trực tiếp từ trang sản phẩm.

## Việc cần làm

- [ ] **12.1** Tạo `src/app/(public)/cua-hang/[slug]/page.tsx` (Server Component):
  - Gọi `getProductBySlug(slug)` từ `src/lib/catalog.ts`
  - Nếu không tìm thấy: `notFound()`
  - Metadata SEO: `generateMetadata` với title, description, og:image từ `photo_url`

- [ ] **12.2** Layout trang sản phẩm:
  - **Left/Top**: ảnh sản phẩm lớn, `<img>` tag (không dùng next/image để tránh domain config issue)
  - **Right/Below**: tên sản phẩm, giá (format VND), giá gốc (gạch ngang nếu có), tỉ lệ giảm giá, badge tag (Windows 11, Office...)
  - Danh sách features (từ `features[]` array)
  - Nút "Thêm vào giỏ" + "Mua ngay" (mở CartDrawer và thêm sản phẩm)
  - Section "Sản phẩm liên quan" (cùng category, tối đa 4 sản phẩm)

- [ ] **12.3** Nút "Thêm vào giỏ": cần Client Component con để tương tác với Cart context.
  Tạo `src/app/(public)/cua-hang/[slug]/add-to-cart-button.tsx` (Client Component).

- [ ] **12.4** Breadcrumb: Trang chủ > Cửa hàng > [Tên sản phẩm].

- [ ] **12.5** Cập nhật link trên storefront (`/cua-hang/page.tsx` và card sản phẩm) để trỏ đến `/cua-hang/[slug]`.

- [ ] **12.6** `generateStaticParams` hoặc `dynamic = 'force-dynamic'` tuỳ theo chiến lược cache.

- [ ] **12.7** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/(public)/cua-hang/[slug]/page.tsx` |
| TẠO MỚI | `src/app/(public)/cua-hang/[slug]/add-to-cart-button.tsx` |
| SỬA | `src/app/(public)/cua-hang/page.tsx` — cập nhật link sản phẩm |
| SỬA | `src/lib/catalog.ts` — thêm getProductBySlug nếu chưa có |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] `/cua-hang/win11pro` trả trang hợp lệ, không 404
- [ ] Title tag đúng (`<title>Windows 11 Pro - WinKey</title>`)
- [ ] Nút "Thêm vào giỏ" → sản phẩm xuất hiện trong CartDrawer
- [ ] Slug không tồn tại → trang 404 của Next.js
- [ ] `npm run lint` sạch

## Cách kiểm thử

1. Truy cập `http://localhost:3000/cua-hang/win11pro` → thấy trang sản phẩm.
2. Kiểm tra `<title>` trong DevTools.
3. Nhấn "Thêm vào giỏ" → mở drawer → có sản phẩm.
4. Truy cập `/cua-hang/slug-khong-ton-tai` → trang 404.
