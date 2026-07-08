# Task 16 — Navbar, Footer & SEO

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Customer UI | P1 | Không | 2–3 giờ |

## Mục tiêu

Hoàn thiện Navbar (thêm menu tài khoản/đăng xuất, menu mobile), sửa các link Footer chưa hoạt động, và thêm SEO/OG metadata + JSON-LD Schema cho các trang quan trọng.

## Hiện trạng & Vấn đề

- Navbar không có menu tài khoản (link đến `/tai-khoan`) hoặc đăng xuất.
- Footer có nhiều link trỏ về `#` hoặc 404.
- Không có `og:image`, `og:description`, hay JSON-LD Schema trên bất kỳ trang nào.
- Thiếu `robots.txt` và `sitemap.xml`.

## Việc cần làm

### Navbar

- [ ] **16.1** Cập nhật `src/components/layout/header.tsx` (hoặc navbar tương đương):
  - Nếu user đăng nhập (Clerk): hiển thị Avatar + dropdown menu:
    - Tài khoản của tôi (`/tai-khoan`)
    - Đơn hàng (`/tai-khoan/don-hang`)
    - Cộng tác viên (`/tai-khoan/affiliate`)
    - Đăng xuất (gọi `signOut()` từ Clerk)
  - Nếu chưa đăng nhập: nút "Đăng nhập" → `/auth/sign-in`.
  - Mobile: hamburger menu với đầy đủ navigation links.

### Footer

- [ ] **16.2** Cập nhật footer (`src/components/layout/footer.tsx` hoặc tương đương):
  - Sửa tất cả link nội bộ: `/cua-hang`, `/tin-tuc`, `/huong-dan`, `/ho-tro`, `/tai-khoan/affiliate`.
  - Thêm link chính sách: `/chinh-sach-bao-mat` (tạo stub page nếu chưa có), `/dieu-khoan-dich-vu`.
  - Social links (nếu có): thêm `rel="noopener noreferrer" target="_blank"`.
  - Copyright năm hiện tại (dynamic: `new Date().getFullYear()`).

### SEO

- [ ] **16.3** Cập nhật `src/app/layout.tsx` — metadata mặc định:
  ```typescript
  export const metadata: Metadata = {
    metadataBase: new URL('https://winkey.vn'),
    title: { default: 'WinKey - Bản quyền Windows & Office chính hãng', template: '%s | WinKey' },
    description: 'Mua bản quyền Windows 11, Windows 10, Office 2021, Office 365 chính hãng...',
    openGraph: { type: 'website', locale: 'vi_VN', images: ['/og-image.jpg'] },
  };
  ```

- [ ] **16.4** Thêm `generateMetadata` vào các trang quan trọng:
  - `src/app/(public)/cua-hang/[slug]/page.tsx` (Task 12)
  - `src/app/(public)/tin-tuc/[slug]/page.tsx`
  - `src/app/(public)/huong-dan/[slug]/page.tsx` (Task 15)

- [ ] **16.5** Tạo `src/app/sitemap.ts` (Next.js Sitemap API):
  - Các trang tĩnh: `/`, `/cua-hang`, `/tin-tuc`, `/huong-dan`, `/ho-tro`
  - Động: product slugs, blog slugs, guide slugs (query từ DB)

- [ ] **16.6** Tạo `src/app/robots.ts`:
  ```typescript
  export default function robots() {
    return { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/tai-khoan/', '/api/'] },
             sitemap: 'https://winkey.vn/sitemap.xml' };
  }
  ```

- [ ] **16.7** JSON-LD Schema cho trang chủ (Organization) và trang sản phẩm (Product).

- [ ] **16.8** Tạo ảnh OG mặc định: `public/og-image.jpg` (1200x630, thiết kế đơn giản với logo WinKey).

- [ ] **16.9** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/components/layout/header.tsx` |
| SỬA | `src/components/layout/footer.tsx` |
| SỬA | `src/app/layout.tsx` — metadata |
| TẠO MỚI | `src/app/sitemap.ts` |
| TẠO MỚI | `src/app/robots.ts` |
| TẠO MỚI | `public/og-image.jpg` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Đăng nhập → Avatar hiện ở navbar với dropdown đầy đủ
- [ ] Đăng xuất từ dropdown → về trang chủ, trạng thái chưa đăng nhập
- [ ] Tất cả link footer dẫn đến đúng trang (không còn `#` hay 404)
- [ ] `curl https://winkey.vn/sitemap.xml` trả XML hợp lệ (sau deploy)
- [ ] DevTools → tab Elements → `<title>` và `<meta og:description>` đúng trên mọi trang

## Cách kiểm thử

1. Kiểm tra navbar: đăng nhập/đăng xuất/dropdown.
2. Click từng link footer → không có 404.
3. View source `/cua-hang/win11pro` → tìm `<meta property="og:title">`.
4. Truy cập `http://localhost:3000/sitemap.xml` → XML hợp lệ.
5. Truy cập `http://localhost:3000/robots.txt` → đúng format.
