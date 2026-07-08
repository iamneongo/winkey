# Task 15 — Guides from DB

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Customer UI | P1 | Không | 2–3 giờ |

## Mục tiêu

Chuyển `/huong-dan` từ nội dung hardcode thành dữ liệu từ DB. Admin có thể thêm/sửa/xóa bài hướng dẫn thông qua giao diện admin, reuse rich-text-editor đã có ở blog.

## Hiện trạng & Vấn đề

- `/huong-dan`: nội dung hardcode trong code, không cập nhật được.
- Không có bảng `guides` trong DB.
- Không có admin quản lý hướng dẫn.

## Schema DB

```sql
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,     -- rich text / markdown
  category TEXT,             -- windows | office | general
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Việc cần làm

- [ ] **15.1** Thêm migration bảng `guides` vào `ensureDatabaseReady`.

- [ ] **15.2** Seed dữ liệu ban đầu: chuyển nội dung hardcode hiện tại thành ít nhất 3–4 bản ghi guides trong DB (dùng INSERT trong migration, chỉ khi bảng mới tạo và count = 0).

- [ ] **15.3** Cập nhật `src/app/(public)/huong-dan/page.tsx`:
  - Query guides từ DB: `SELECT * FROM guides WHERE is_published = TRUE ORDER BY sort_order ASC`
  - Nhóm theo `category`
  - Sidebar navigation theo category + list bài
  - Render nội dung markdown/rich text

- [ ] **15.4** Tạo `src/app/(public)/huong-dan/[slug]/page.tsx`:
  - Render nội dung chi tiết bài hướng dẫn
  - Breadcrumb + metadata SEO
  - Sidebar: danh sách bài cùng category
  - "Bài tiếp theo / Bài trước" navigation

- [ ] **15.5** Tạo admin routes (reuse pattern từ blogs):
  - `/admin/guides/page.tsx` — danh sách, filter, phân trang
  - `/admin/guides/new/page.tsx` — tạo mới (reuse rich-text-editor của blogs)
  - `/admin/guides/[id]/page.tsx` — sửa
  - Thêm "Hướng dẫn" vào sidebar admin (`src/config/nav-config.ts`)

- [ ] **15.6** API routes (reuse pattern từ blogs):
  - `POST /api/admin/guides` — tạo
  - `PUT /api/admin/guides/[id]` — sửa
  - `DELETE /api/admin/guides/[id]` — xóa

- [ ] **15.7** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| SỬA | `src/app/(public)/huong-dan/page.tsx` |
| TẠO MỚI | `src/app/(public)/huong-dan/[slug]/page.tsx` |
| TẠO MỚI | `src/app/admin/guides/page.tsx` |
| TẠO MỚI | `src/app/admin/guides/new/page.tsx` |
| TẠO MỚI | `src/app/admin/guides/[id]/page.tsx` |
| TẠO MỚI | `src/app/api/admin/guides/route.ts` + `[id]/route.ts` |
| SỬA | `src/lib/catalog.ts` — migration + data functions |
| SỬA | `src/config/nav-config.ts` — thêm Guides vào admin nav |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] `/huong-dan` hiển thị nội dung từ DB (không còn hardcode)
- [ ] Admin tạo guide mới → xuất hiện trên `/huong-dan`
- [ ] Slug tự sinh từ title (tương tự blog)
- [ ] `is_published = false` → không hiển thị trên public, chỉ thấy trong admin

## Cách kiểm thử

1. Vào `/admin/guides/new` → tạo guide "Cách kích hoạt Windows 11" → Publish.
2. Truy cập `/huong-dan/cach-kich-hoat-windows-11` → thấy nội dung.
3. Unpublish trong admin → truy cập lại → 404.
