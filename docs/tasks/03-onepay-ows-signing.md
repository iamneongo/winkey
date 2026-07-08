# Task 03 — OnePay OWS Signing Util

| Nhóm | Ưu tiên | Phụ thuộc | Ước lượng |
|------|---------|-----------|-----------|
| Payment | P0 | Task 01 | 3–4 giờ |

## Mục tiêu

Xây dựng module ký/verify chữ ký OWS1-HMAC-SHA256 chuẩn OnePay PayCollect, và HTTP client để gọi tất cả OnePay API. Đây là nền tảng cho mọi tích hợp thanh toán sau.

## Hiện trạng & Vấn đề

Chưa có bất kỳ code nào liên quan OnePay. Mọi thanh toán hiện là mock client-side.

## Thông số kỹ thuật OWS1-HMAC-SHA256

Header cần gửi trong mọi request:
```
X-OP-Authorization: OWS1-HMAC-SHA256 Credential=<client_id>/<yyyyMMdd>/onepay/paycollect/ows1_request,
  SignedHeaders=x-op-date;x-op-expires,
  Signature=<hex>
X-OP-Date: <yyyyMMdd'T'HHmmss'Z'>
X-OP-Expires: <số giây hiệu lực, vd: 300>
```

**Cách tạo chữ ký:**
1. `canonicalRequest = METHOD\nURI\nQUERY\nHEADERS\nSIGNED_HEADER_NAMES\nHEX(SHA256(body))`
2. `stringToSign = "OWS1-HMAC-SHA256\n" + timestamp + "\n" + scope + "\n" + HEX(SHA256(canonicalRequest))`
3. `signingKey = HMAC(HMAC(HMAC(HMAC("OWS1" + secret, date), "onepay"), "paycollect"), "ows1_request")`
4. `signature = HEX(HMAC(signingKey, stringToSign))`

Tham chiếu sample code OnePay trên Google Drive (hỏi chủ dự án lấy link nếu cần).

## Việc cần làm

- [ ] **03.1** Tạo `src/lib/onepay/signing.ts`:
  - Export function `signRequest({ method, url, body, accessKeyId, secretKey, clientId }): Record<string, string>` — trả object chứa các header `X-OP-Authorization`, `X-OP-Date`, `X-OP-Expires`.
  - Dùng Node.js built-in `crypto` (HMAC-SHA256) — không dùng thư viện ngoài.
  - Đảm bảo timestamp UTC, format `yyyyMMdd'T'HHmmss'Z'`.

- [ ] **03.2** Tạo `src/lib/onepay/client.ts`:
  - Export `onePayClient` với các method:
    - `createBatch(payload)` → POST `<base>/batchs` (API 8)
    - `createUserAndInvoice(userRef, invoiceRef, amount, description)` → PUT user + PUT invoice
    - `getInvoiceStatus(userRef, invoiceRef)` → GET trạng thái
    - `disableUser(userRef)` → PATCH state=inactive (API 4)
  - Mọi request đều gọi `signRequest` để lấy headers và gắn vào fetch.
  - Xử lý lỗi HTTP: throw `OnePayError` với `statusCode` + `message`.

- [ ] **03.3** Tạo `src/lib/onepay/types.ts`: TypeScript interfaces cho request/response bodies (Invoice, User, Batch...).

- [ ] **03.4** Tạo `src/lib/onepay/index.ts`: re-export tất cả.

- [ ] **03.5** Đọc env vars từ `process.env`:
  ```
  ONEPAY_BASE_URL, ONEPAY_CLIENT_ID, ONEPAY_PARTNER_ID,
  ONEPAY_ACCESS_KEY_ID, ONEPAY_SECRET_KEY
  ```
  Throw lỗi rõ ràng nếu thiếu bất kỳ biến nào.

- [ ] **03.6** Viết unit test đơn giản (inline hoặc file `__tests__`) verify chữ ký đầu ra khớp với test vector từ OnePay docs.

## File sẽ tạo/sửa

| Hành động | File |
|-----------|------|
| TẠO MỚI | `src/lib/onepay/signing.ts` |
| TẠO MỚI | `src/lib/onepay/client.ts` |
| TẠO MỚI | `src/lib/onepay/types.ts` |
| TẠO MỚI | `src/lib/onepay/index.ts` |

## Tiêu chí hoàn thành (Definition of Done)

- [ ] `signRequest` tạo ra chữ ký đúng format OWS1-HMAC-SHA256
- [ ] `onePayClient.createUserAndInvoice(...)` gọi thành công đến MTF sandbox (HTTP 200/201)
- [ ] Nếu `ONEPAY_SECRET_KEY` sai → API trả 403, client throw `OnePayError`
- [ ] `npm run lint` và TypeScript compile không lỗi
- [ ] Không có secret nào hardcode trong source code (chỉ qua env)

## Cách kiểm thử

```typescript
// test-signing.ts (chạy với: npx tsx test-signing.ts)
import { onePayClient } from './src/lib/onepay';

async function test() {
  // Tạo user tạm trên MTF
  const result = await onePayClient.createUserAndInvoice(
    'TEST_USER_001',
    'INV_001',
    50000,
    'Test WinKey Order'
  );
  console.log('Invoice created:', result);
}
test().catch(console.error);
```
