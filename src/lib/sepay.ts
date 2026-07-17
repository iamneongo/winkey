/**
 * SePay (sepay.vn) payment integration.
 *
 * Flow:
 *  1. Checkout shows a VietQR image (qr.sepay.vn) for the shop's bank account,
 *     with a unique transfer memo per order: `${SEPAY_PAYMENT_PREFIX}<orderId>`.
 *  2. SePay watches the bank account and calls our webhook
 *     (POST /api/payment/sepay-webhook) when a matching incoming transfer arrives.
 *  3. The webhook extracts the order id from the memo, verifies the amount and
 *     marks the order as paid (license key + affiliate commission included).
 *
 * Required environment variables:
 *  - SEPAY_BANK_ACCOUNT   Bank account number receiving payments.
 *  - SEPAY_BANK_CODE      Bank short name as used by SePay/VietQR (e.g. "MBBank", "VCB").
 * Optional:
 *  - SEPAY_ACCOUNT_HOLDER Account holder name (shown in some banking apps).
 *  - SEPAY_PAYMENT_PREFIX Memo prefix, default "WINKEY". Letters/digits only.
 *  - SEPAY_WEBHOOK_API_KEY If set, the webhook requires the header
 *                          `Authorization: Apikey <key>` (configure the same key
 *                          in the SePay dashboard webhook settings).
 */

const DEFAULT_PREFIX = 'WINKEY';

export function getSepayPaymentPrefix(): string {
  const raw = (process.env.SEPAY_PAYMENT_PREFIX || DEFAULT_PREFIX).trim();
  // Bank transfer memos are safest with plain uppercase letters/digits.
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return cleaned || DEFAULT_PREFIX;
}

export function isSepayConfigured(): boolean {
  return Boolean(process.env.SEPAY_BANK_ACCOUNT && process.env.SEPAY_BANK_CODE);
}

/** Transfer memo used to match a bank transaction back to an order. */
export function buildSepayPaymentCode(orderId: number): string {
  return `${getSepayPaymentPrefix()}${orderId}`;
}

/** VietQR image URL rendered by SePay for the configured bank account. */
export function buildSepayQrUrl(orderId: number, amount: number): string {
  const account = process.env.SEPAY_BANK_ACCOUNT;
  const bank = process.env.SEPAY_BANK_CODE;
  if (!account || !bank) {
    throw new Error('SePay is not configured (missing SEPAY_BANK_ACCOUNT / SEPAY_BANK_CODE).');
  }

  const params = new URLSearchParams({
    acc: account,
    bank,
    amount: String(Math.round(amount)),
    des: buildSepayPaymentCode(orderId),
    template: 'compact'
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
}

/**
 * Extract the order id from a SePay transaction.
 * Prefers the `code` field (SePay's auto-extracted payment code, when the
 * pattern is configured in their dashboard), then falls back to scanning the
 * free-text transfer content.
 */
export function extractOrderIdFromTransaction(params: {
  code?: string | null;
  content?: string | null;
}): number | null {
  const prefix = getSepayPaymentPrefix();
  const pattern = new RegExp(`${prefix}\\s*0*(\\d+)`, 'i');

  for (const candidate of [params.code, params.content]) {
    if (!candidate) continue;
    const match = pattern.exec(candidate);
    if (match) {
      const id = parseInt(match[1], 10);
      if (Number.isFinite(id) && id > 0) return id;
    }
  }

  return null;
}

/** Validate the webhook Authorization header when SEPAY_WEBHOOK_API_KEY is set. */
export function isValidSepayWebhookAuth(authorizationHeader: string | null): boolean {
  const expected = process.env.SEPAY_WEBHOOK_API_KEY?.trim();
  if (!expected) return true; // auth not enforced when no key configured

  if (!authorizationHeader) return false;
  const match = /^Apikey\s+(.+)$/i.exec(authorizationHeader.trim());
  return Boolean(match && match[1].trim() === expected);
}
