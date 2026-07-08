# WinKey — Backlog Tổng (Task Index)

> **Agent đọc file này trước tiên.** Mỗi task có file riêng trong thư mục `docs/tasks/`. Đọc AGENTS.md ở gốc dự án + `node_modules/next/dist/docs/` trước khi viết code. Chạy `npm run lint` sau mỗi thay đổi. Không commit khi chưa được yêu cầu.

## Tiến độ

| STT | Tên Task | Nhóm | Ưu tiên | Trạng thái |
|-----|----------|-------|---------|------------|
| 01 | [Fix Order API & Customer Linkage](./01-fix-order-api-and-customer-linkage.md) | Backend | P0 | [ ] |
| 02 | [API Auth Hardening](./02-api-auth-hardening.md) | Backend | P0 | [ ] |
| 03 | [OnePay OWS Signing Util](./03-onepay-ows-signing.md) | Payment | P0 | [ ] |
| 04 | [OnePay Create VA + Invoice](./04-onepay-create-va-invoice.md) | Payment | P0 | [x] |
| 05 | [Checkout QR Flow UI](./05-checkout-qr-flow-ui.md) | Payment | P0 | [x] |
| 06 | [OnePay IPN Webhook](./06-onepay-ipn-webhook.md) | Payment | P0 | [x] |
| 07 | [License Key Inventory](./07-license-key-inventory.md) | Payment | P0 | [x] |
| 08 | [Admin Orders Management](./08-admin-orders-management.md) | Admin | P1 | [x] |
| 09 | [Admin Affiliates & Commission](./09-admin-affiliates-and-commission.md) | Admin | P1 | [x] |
| 10 | [Admin Blogs Delete & Polish](./10-admin-blogs-delete-and-list-polish.md) | Admin | P1 | [x] |
| 11 | [Admin Notifications](./11-admin-notifications.md) | Admin | P1 | [x] |
| 12 | [Product Detail Page](./12-product-detail-page.md) | Customer UI | P1 | [x] |
| 13 | [Account Profile & Orders](./13-account-profile-and-orders.md) | Customer UI | P1 | [x] |
| 14 | [Affiliate Dashboard Enhancements](./14-affiliate-dashboard-enhancements.md) | Customer UI | P1 | [x] |
| 15 | [Guides from DB](./15-guides-from-db.md) | Customer UI | P1 | [x] |
| 16 | [Navbar, Footer & SEO](./16-navbar-footer-seo.md) | Customer UI | P1 | [x] |
| 17 | [Transactional Email](./17-transactional-email.md) | Integration | P2 | [x] |
| 18 | [Cloud File Storage](./18-cloud-file-storage.md) | Integration | P2 | [x] |

**Legend:** `[ ]` chưa làm · `[~]` đang làm · `[x]` xong

---

## Quy tắc cho Agent

1. **Đọc trước**: `AGENTS.md` (gốc dự án) + `node_modules/next/dist/docs/` trước khi viết bất kỳ dòng code nào.
2. **Reuse**: Dùng `db` từ `src/lib/db.ts`, `ensureDatabaseReady` từ `src/lib/catalog.ts`, Shadcn UI components hiện có.
3. **Lint**: Chạy `npm run lint` sau mỗi thay đổi; sửa hết trước khi báo xong.
4. **Không commit** khi chưa được yêu cầu tường minh.
5. **Phụ thuộc**: Tasks P0 phải xong trước P1; trong P0, task 01→02 nên xong trước 03–07.
6. **Môi trường OnePay**: Dùng base URL MTF `https://mtf.onepay.vn/paycollect/api/v1` (sandbox). IPN URL cần public (dùng ngrok/tunnel khi dev local).

---

## Môi trường & Config

### Env vars hiện có (xem .env.local)
- `DATABASE_URL` — PostgreSQL connection string
- `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Env vars cần thêm (cho task 03–06)
```
ONEPAY_BASE_URL=https://mtf.onepay.vn/paycollect/api/v1
ONEPAY_CLIENT_ID=TESTPC2
ONEPAY_PARTNER_ID=<lấy từ chủ dự án>
ONEPAY_ACCESS_KEY_ID=<lấy từ chủ dự án>
ONEPAY_SECRET_KEY=PC7525892B2E41A8845E210BF0114BA2
ONEPAY_IPN_URL=<public-url>/api/payment/ipn
```

---

## Stack tham chiếu
- **Framework**: Next.js 16.2.10 (Turbopack), React 19
- **Auth**: Clerk (`@clerk/nextjs`)
- **DB**: PostgreSQL qua `pg` Pool (`src/lib/db.ts`)
- **UI**: Shadcn/ui, Tailwind v4
- **Validation**: Zod (`src/lib/api-schemas.ts` — thêm nếu chưa có)
