// ─── OnePay PayCollect API — TypeScript Types ────────────────────────────────

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------

export type UserState = 'active' | 'inactive';
export type InvoiceState = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface OnePayUser {
  /** Unique reference for the user within this partner (≤ 50 chars) */
  user_reference: string;
  /** Display name */
  name?: string;
  /** ISO-8601 date-of-birth or any identifier label */
  label?: string;
  /** 'active' | 'inactive' */
  state?: UserState;
}

export interface CreateUserRequest {
  user_reference: string;
  name?: string;
  label?: string;
}

export interface UpdateUserStateRequest {
  state: UserState;
}

export interface OnePayUserResponse {
  user_reference: string;
  name?: string;
  label?: string;
  state: UserState;
  va_number?: string;
  va_bank?: string;
  created_at?: string;
  updated_at?: string;
}

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

export interface CreateInvoiceRequest {
  invoice_reference: string;
  /** Amount in VND (integer) */
  amount: number;
  description?: string;
  /** ISO-8601 expiry date-time */
  expired_at?: string;
}

export interface OnePayInvoiceResponse {
  invoice_reference: string;
  user_reference: string;
  amount: number;
  description?: string;
  state: InvoiceState;
  va_number?: string;
  va_bank?: string;
  created_at?: string;
  updated_at?: string;
  expired_at?: string;
}

// ---------------------------------------------------------------------------
// Batch (API 8)
// ---------------------------------------------------------------------------

export interface BatchUserItem {
  user_reference: string;
  name?: string;
  label?: string;
}

export interface BatchInvoiceItem {
  user_reference: string;
  invoice_reference: string;
  amount: number;
  description?: string;
  expired_at?: string;
}

export interface CreateBatchRequest {
  users?: BatchUserItem[];
  invoices?: BatchInvoiceItem[];
}

export interface BatchResultItem {
  user_reference?: string;
  invoice_reference?: string;
  status: 'success' | 'error';
  error?: string;
  data?: OnePayUserResponse | OnePayInvoiceResponse;
}

export interface CreateBatchResponse {
  batch_id?: string;
  results: BatchResultItem[];
}

// ---------------------------------------------------------------------------
// Sign-request params
// ---------------------------------------------------------------------------

export interface SignRequestParams {
  method: string;
  url: string;
  /** Raw request body — pass empty string for GET/DELETE */
  body: string;
  accessKeyId: string;
  secretKey: string;
  clientId: string;
  /** Expiry in seconds (default: 300) */
  expiresIn?: number;
}

export type SignedHeaders = Record<string, string>;

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export class OnePayError extends Error {
  public readonly statusCode: number;
  public readonly rawBody: string;

  constructor(statusCode: number, message: string, rawBody = '') {
    super(message);
    this.name = 'OnePayError';
    this.statusCode = statusCode;
    this.rawBody = rawBody;
    // Restore prototype chain (needed when transpiling to ES5)
    Object.setPrototypeOf(this, OnePayError.prototype);
  }
}
