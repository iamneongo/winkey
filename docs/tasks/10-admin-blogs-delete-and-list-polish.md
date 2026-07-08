# Task 10 — Admin Blogs Delete & List Polish

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Admin | P1 | Không | 2 giờ |

## Mục tiêu

Hoàn thiện trang quản lý Blog trong Admin: thêm chức năng xóa bài viết, tìm kiếm/lọc theo trạng thái, và phân trang danh sách.

## Hiện trạng & Vấn đề

- `/admin/blogs`: Có Create/Edit nhưng **không có Delete**.
- Không có tìm kiếm bài viết theo tiêu đề.
- Không có lọc theo `is_published` (nháp/đã xuất bản).
- Không có phân trang (nếu có nhiều bài sẽ load hết một lúc).

## Việc cần làm

- [ ] **10.1** Tạo Client Component `src/app/admin/blogs/delete-button.tsx`:
  - Props: `{ blogId: number, blogTitle: string }`
  - Dùng `AlertDialog` từ Shadcn/ui để confirm trước khi xóa
  - Gọi `DELETE /api/admin/blogs/[id]` khi confirm
  - Sau khi xóa: gọi `router.refresh()` để cập nhật danh sách

- [ ] **10.2** Tạo `DELETE /api/admin/blogs/[id]` (yêu cầu admin auth từ Task 02):
  - Xóa bài viết theo ID
  - Nếu có file upload gắn với bài viết: cân nhắc xóa file hoặc bỏ qua (document rõ quyết định)
  - Trả 200 hoặc 404 nếu không tìm thấy

- [ ] **10.3** Thêm filter/search vào `src/app/admin/blogs/page.tsx`:
  - Search box tìm theo tiêu đề (URL param `?q=`)
  - Filter tab: Tất cả / Đã xuất bản / Bản nháp (URL param `?status=`)
  - Phân trang: 15 bài/trang (URL param `?page=`)

- [ ] **10.4** Cập nhật data function `getBlogs` trong `src/lib/catalog.ts` để hỗ trợ các params mới: `{ q?, status?, page?, limit? }`.

- [ ] **10.5** Thêm cột `Delete` vào bảng danh sách, render `<DeleteButton />`.

- [ ] **10.6** Chạy `npm run lint`.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/app/admin/blogs/delete-button.tsx` |
| TẠO MỚI | `src/app/api/admin/blogs/[id]/route.ts` |
| SỬA | `src/app/admin/blogs/page.tsx` |
| SỬA | `src/lib/catalog.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] Nhấn Delete → AlertDialog xuất hiện → Confirm → bài bị xóa khỏi DB và danh sách
- [ ] Tìm kiếm theo tiêu đề hoạt động
- [ ] Filter "Bản nháp" chỉ hiển thị bài có `is_published = false`
- [ ] Phân trang hoạt động

## Cách kiểm thử

1. Tạo 16+ bài viết (dùng DB seeding hoặc UI).
2. Truy cập `/admin/blogs?page=2` → thấy trang 2.
3. Tìm `/admin/blogs?q=windows` → chỉ thấy bài có "windows" trong tiêu đề.
4. Nhấn Delete trên 1 bài → confirm → bài biến mất.
