/**
 * OnePay PayCollect HTTP client.
 *
 * Reads configuration from environment variables at module load time.
 * Throws a descriptive error if any required variable is missing.
 */

import { signRequest } from './signing';
import type {
  CreateBatchRequest,
  CreateBatchResponse,
  CreateInvoiceRequest,
  OnePayInvoiceResponse,
  OnePayUserResponse,
} from './types';
import { OnePayError } from './types';

// ---------------------------------------------------------------------------
// Config — validate env vars eagerly
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[OnePay] Missing required environment variable: ${name}. ` +
        `Add it to your .env.local or deployment environment settings.`,
    );
  }
  return value;
}

function getConfig() {
  return {
    baseUrl: requireEnv('ONEPAY_BASE_URL').replace(/\/$/, ''),
    clientId: requireEnv('ONEPAY_CLIENT_ID'),
    partnerId: requireEnv('ONEPAY_PARTNER_ID'),
    accessKeyId: requireEnv('ONEPAY_ACCESS_KEY_ID'),
    secretKey: requireEnv('ONEPAY_SECRET_KEY'),
  };
}

// ---------------------------------------------------------------------------
// Internal fetch wrapper
// ---------------------------------------------------------------------------

async function onePayFetch<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const cfg = getConfig();
  const url = `${cfg.baseUrl}${path}`;
  const bodyStr = body !== undefined ? JSON.stringify(body) : '';

  const sigHeaders = signRequest({
    method,
    url,
    body: bodyStr,
    accessKeyId: cfg.accessKeyId,
    secretKey: cfg.secretKey,
    clientId: cfg.clientId,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...sigHeaders,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: bodyStr || undefined,
  });

  const rawText = await res.text();

  if (!res.ok) {
    let message = `OnePay API error: HTTP ${res.status}`;
    try {
      const parsed = JSON.parse(rawText) as { message?: string; error?: string };
      message = parsed.message ?? parsed.error ?? message;
    } catch {
      // keep default message
    }
    throw new OnePayError(res.status, message, rawText);
  }

  // Some endpoints return 204 No Content
  if (!rawText) return {} as T;

  return JSON.parse(rawText) as T;
}

// ---------------------------------------------------------------------------
// Client methods
// ---------------------------------------------------------------------------

/**
 * POST /batchs — Create users and/or invoices in a single batch (API 8).
 */
async function createBatch(
  payload: CreateBatchRequest,
): Promise<CreateBatchResponse> {
  return onePayFetch<CreateBatchResponse>('POST', '/batchs', payload);
}

/**
 * PUT /partners/{partner_id}/users/{user_reference}
 * Create or update a user (VA holder).
 */
async function createUser(
  userRef: string,
  data: { name?: string; label?: string },
): Promise<OnePayUserResponse> {
  const cfg = getConfig();
  const path = `/partners/${cfg.partnerId}/users/${encodeURIComponent(userRef)}`;
  return onePayFetch<OnePayUserResponse>('PUT', path, {
    user_reference: userRef,
    ...data,
  });
}

/**
 * PUT /partners/{partner_id}/users/{user_reference}/invoices/{invoice_reference}
 * Create or update an invoice for a user.
 */
async function createInvoice(
  userRef: string,
  invoiceData: CreateInvoiceRequest,
): Promise<OnePayInvoiceResponse> {
  const cfg = getConfig();
  const path =
    `/partners/${cfg.partnerId}/users/${encodeURIComponent(userRef)}` +
    `/invoices/${encodeURIComponent(invoiceData.invoice_reference)}`;
  return onePayFetch<OnePayInvoiceResponse>('PUT', path, invoiceData);
}

/**
 * Convenience: create user then invoice sequentially.
 * Returns the invoice response (which also contains VA info).
 */
async function createUserAndInvoice(
  userRef: string,
  invoiceRef: string,
  amount: number,
  description?: string,
): Promise<OnePayInvoiceResponse> {
  const batchRes = await createBatch({
    users: [{ user_reference: userRef, name: userRef }],
    invoices: [
      {
        user_reference: userRef,
        invoice_reference: invoiceRef,
        amount,
        description,
      },
    ],
  });

  const invoiceResult = batchRes.results?.find((r) => r.invoice_reference === invoiceRef);
  
  if (!invoiceResult || invoiceResult.status === 'error') {
    throw new Error(invoiceResult?.error || 'Failed to create invoice in batch');
  }

  return invoiceResult.data as OnePayInvoiceResponse;
}

/**
 * GET /partners/{partner_id}/users/{user_reference}/invoices/{invoice_reference}
 * Fetch current state of an invoice.
 */
async function getInvoiceStatus(
  userRef: string,
  invoiceRef: string,
): Promise<OnePayInvoiceResponse> {
  const cfg = getConfig();
  const path =
    `/partners/${cfg.partnerId}/users/${encodeURIComponent(userRef)}` +
    `/invoices/${encodeURIComponent(invoiceRef)}`;
  return onePayFetch<OnePayInvoiceResponse>('GET', path);
}

/**
 * PATCH /partners/{partner_id}/users/{user_reference}
 * Set user state to 'inactive' to disable their Virtual Account (API 4).
 */
async function disableUser(userRef: string): Promise<OnePayUserResponse> {
  const cfg = getConfig();
  const path = `/partners/${cfg.partnerId}/users/${encodeURIComponent(userRef)}`;
  return onePayFetch<OnePayUserResponse>('PATCH', path, { state: 'inactive' });
}

// ---------------------------------------------------------------------------
// Exported client object
// ---------------------------------------------------------------------------

export const onePayClient = {
  createBatch,
  createUser,
  createInvoice,
  createUserAndInvoice,
  getInvoiceStatus,
  disableUser,
} as const;
