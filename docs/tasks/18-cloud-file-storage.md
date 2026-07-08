# Task 18 — Cloud File Storage

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Integration | P2 | Không | 3 giờ |

## Mục tiêu

Chuyển việc lưu trữ file upload (ảnh thumbnail blog, ảnh sản phẩm) từ `public/uploads/` local sang cloud storage (Cloudflare R2 ưu tiên vì free tier rộng, hoặc Vercel Blob).

## Hiện trạng & Vấn đề

- File upload hiện lưu vào `public/uploads/` — mất dữ liệu mỗi khi redeploy trên Vercel (ephemeral filesystem).
- `POST /api/uploads` ghi file local → không scale.
- Không có CDN, ảnh tải chậm.

## Quyết định kỹ thuật

Dùng **Vercel Blob** (nếu deploy trên Vercel — tích hợp tốt nhất, `@vercel/blob` package) hoặc **Cloudflare R2** (nếu muốn kiểm soát nhiều hơn).

> **Hỏi chủ dự án**: Dùng Vercel Blob hay Cloudflare R2? Nếu Cloudflare R2: cần `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.

Hướng dẫn dưới dùng Vercel Blob làm mặc định.

## Việc cần làm

- [ ] **18.1** Cài đặt: `npm install @vercel/blob`
- [ ] **18.2** Thêm env: `BLOB_READ_WRITE_TOKEN` (lấy từ Vercel Dashboard → Storage → Blob)

- [ ] **18.3** Cập nhật `src/app/api/uploads/route.ts`:
  - Thay `fs.writeFile` bằng `put(filename, file, { access: 'public' })` từ `@vercel/blob`
  - Trả `url` (CDN URL) thay vì `/uploads/...` path local

- [ ] **18.4** Cập nhật admin upload UI (blog editor, product editor):
  - Sau upload thành công, nhận `url` từ response và lưu vào form field `cover_url` / `photo_url`
  - Không còn hard-path `/uploads/...` nữa

- [ ] **18.5** Migration: cập nhật bản ghi hiện có trong DB:
  - Script `src/scripts/migrate-images-to-blob.ts`: đọc file từ `public/uploads/`, upload lên Blob, cập nhật URL trong DB cho blogs và products.
  - Script chỉ chạy một lần, document rõ trong README.

- [ ] **18.6** Xóa `public/uploads/` khỏi git tracking (thêm vào `.gitignore`), giữ lại file hiện có cho migration.

- [ ] **18.7** Cập nhật `src/app/admin/blogs/page.tsx` và các nơi khác đang dùng `<img src="/uploads/...">` để dùng URL từ DB trực tiếp (không thay đổi logic, chỉ URL format thay đổi).

- [ ] **18.8** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/api/uploads/route.ts` |
| TẠO MỚI | `src/scripts/migrate-images-to-blob.ts` |
| SỬA | `.gitignore` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Upload ảnh blog trong admin → `cover_url` trong DB là URL dạng `https://xxxx.public.blob.vercel-storage.com/...`
- [ ] Ảnh hiển thị đúng trên storefront và admin
- [ ] Redeploy app → ảnh cũ vẫn hiển thị (không mất)
- [ ] `public/uploads/` không còn trong git (trừ file .gitkeep nếu cần)

## Cách kiểm thử

1. Vào `/admin/blogs/new`, upload ảnh cover.
2. Kiểm tra DB: `cover_url` phải là URL blob, không phải `/uploads/...`.
3. Mở URL blob trong browser → ảnh hiển thị.
4. Simulate redeploy: xóa `public/uploads/` local → ảnh vẫn hiển thị trên web (lấy từ Blob CDN).

## Lưu ý

- Nếu dùng Cloudflare R2: cần dùng `@aws-sdk/client-s3` với endpoint R2. Tham khảo: https://developers.cloudflare.com/r2/api/s3/sdk/
- File size limit: cấu hình Next.js `bodySizeLimit` nếu cần upload ảnh > 4MB.
