/**
 * OWS1-HMAC-SHA256 signing utilities for OnePay PayCollect API.
 *
 * References:
 *  - X-OP-Authorization header format (OnePay PayCollect API spec)
 *  - AWS Signature V4 (same derivation concept adapted for OnePay)
 */

import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { SignRequestParams, SignedHeaders } from './types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Hex-encode a SHA-256 hash of a UTF-8 string. */
function sha256Hex(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

/** HMAC-SHA256: key can be string or Buffer, data is always a string. */
function hmacSha256(key: string | Buffer, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

/** Hex-encode a Buffer. */
function toHex(buf: Buffer): string {
  return buf.toString('hex');
}

/**
 * Format a Date as `yyyyMMdd'T'HHmmss'Z'` (UTC).
 * Example: 20260708T125822Z
 */
export function formatTimestamp(date: Date): string {
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const y = date.getUTCFullYear();
  const mo = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const h = pad2(date.getUTCHours());
  const mi = pad2(date.getUTCMinutes());
  const s = pad2(date.getUTCSeconds());
  return `${y}${mo}${d}T${h}${mi}${s}Z`;
}

/**
 * Extract only the date portion: `yyyyMMdd` (UTC).
 * Example: 20260708
 */
export function formatDate(date: Date): string {
  return formatTimestamp(date).slice(0, 8);
}

// ---------------------------------------------------------------------------
// Signing-key derivation
// ---------------------------------------------------------------------------

/**
 * Derive the OWS1 signing key:
 *   HMAC(HMAC(HMAC(HMAC('OWS1' + secret, date), 'onepay'), 'paycollect'), 'ows1_request')
 */
function deriveSigningKey(secretKey: string, date: string): Buffer {
  const kDate = hmacSha256('OWS1' + secretKey, date);
  const kRegion = hmacSha256(kDate, 'onepay');
  const kService = hmacSha256(kRegion, 'paycollect');
  const kSigning = hmacSha256(kService, 'ows1_request');
  return kSigning;
}

// ---------------------------------------------------------------------------
// Main export: signRequest
// ---------------------------------------------------------------------------

/**
 * Sign an HTTP request with OWS1-HMAC-SHA256 and return the three required
 * headers that must be attached to every OnePay API call.
 *
 * @returns Object with keys: `X-OP-Authorization`, `X-OP-Date`, `X-OP-Expires`
 */
export function signRequest(params: SignRequestParams): SignedHeaders {
  const {
    method,
    url,
    body,
    accessKeyId,
    secretKey,
    clientId,
    expiresIn = 300,
  } = params;

  // 1. Parse the URL to extract URI path and query string
  const parsedUrl = new URL(url);
  const uri = parsedUrl.origin + parsedUrl.pathname;
  const queryString = parsedUrl.searchParams.toString();

  // 2. Build timestamp / date
  const now = new Date();
  const timestamp = formatTimestamp(now);
  const date = formatDate(now);

  // 3. Canonical signed headers (only x-op-date and x-op-expires)
  //    Must be in sorted alphabetical order by header name (lower-cased).
  const canonicalHeaders =
    `x-op-date:${timestamp}\n` + `x-op-expires:${expiresIn}\n`;
  const signedHeaderNames = 'x-op-date;x-op-expires';

  // 4. Hash of request body (empty string for GET/DELETE)
  const bodyHash = sha256Hex(body);

  // 5. Canonical request
  const canonicalRequest = [
    method.toUpperCase(),
    uri,
    queryString,
    canonicalHeaders,
    signedHeaderNames,
    bodyHash,
  ].join('\n');

  // 6. Scope and string-to-sign
  const scope = `${date}/onepay/paycollect/ows1_request`;
  const stringToSign = [
    'OWS1-HMAC-SHA256',
    timestamp,
    scope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  // 7. Signing key and signature
  const signingKey = deriveSigningKey(secretKey, date);
  const signature = toHex(hmacSha256(signingKey, stringToSign));

  // 8. Credential uses clientId per OnePay spec.
  //    accessKeyId is kept in params for potential future use.
  void accessKeyId;
  const credential = `${clientId}/${date}/onepay/paycollect/ows1_request`;

  // 9. Authorization header
  const authorization =
    `OWS1-HMAC-SHA256 Credential=${credential},` +
    ` SignedHeaders=${signedHeaderNames},` +
    ` Signature=${signature}`;

  return {
    'X-OP-Authorization': authorization,
    'X-OP-Date': timestamp,
    'X-OP-Expires': String(expiresIn),
  };
}

// ---------------------------------------------------------------------------
// IPN signature verification
// ---------------------------------------------------------------------------

export interface VerifySignatureOptions {
  method: string;
  url: string;
  /** Raw body string exactly as received */
  body: string;
  /** Headers received from OnePay (any casing) */
  receivedHeaders: Record<string, string | string[] | undefined>;
  secretKey: string;
  clientId: string;
  /** Maximum allowed clock skew in seconds (default: 300) */
  maxClockSkewSeconds?: number;
}

/**
 * Verify an incoming IPN (Instant Payment Notification) request from OnePay.
 *
 * Usage in an API route handler:
 * ```ts
 * const ok = verifySignature({
 *   method: 'POST',
 *   url: req.url,
 *   body: rawBodyString,
 *   receivedHeaders: Object.fromEntries(req.headers),
 *   secretKey: process.env.ONEPAY_SECRET_KEY!,
 *   clientId: process.env.ONEPAY_CLIENT_ID!,
 * });
 * if (!ok) return new Response('Forbidden', { status: 403 });
 * ```
 */
export function verifySignature(options: VerifySignatureOptions): boolean {
  const {
    method,
    url,
    body,
    receivedHeaders,
    secretKey,
    maxClockSkewSeconds = 300,
  } = options;

  // Normalise header lookup (headers may arrive in any case)
  const getHeader = (name: string): string | undefined => {
    const lower = name.toLowerCase();
    for (const [k, v] of Object.entries(receivedHeaders)) {
      if (k.toLowerCase() === lower) {
        return Array.isArray(v) ? v[0] : v;
      }
    }
    return undefined;
  };

  const receivedDate = getHeader('x-op-date');
  const receivedAuth = getHeader('x-op-authorization');

  if (!receivedDate || !receivedAuth) return false;

  // ── Clock-skew check ──────────────────────────────────────────────────────
  const tsMatch = receivedDate.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
  );
  if (!tsMatch) return false;

  const [, yr, mo, dy, hh, mm, ss] = tsMatch;
  const receivedTime = Date.UTC(
    Number(yr),
    Number(mo) - 1,
    Number(dy),
    Number(hh),
    Number(mm),
    Number(ss),
  );
  const skewSecs = Math.abs(Date.now() - receivedTime) / 1000;
  if (skewSecs > maxClockSkewSeconds) return false;

  // ── Re-derive expected signature ──────────────────────────────────────────
  const parsedUrl = new URL(url);
  const uri = parsedUrl.pathname || '/';
  const queryString = parsedUrl.searchParams.toString();
  const timestamp = receivedDate;
  const date = timestamp.slice(0, 8);
  const receivedExpires = getHeader('x-op-expires');
  const expiresIn = receivedExpires ? Number(receivedExpires) : 300;

  const canonicalHeaders =
    `x-op-date:${timestamp}\n` + `x-op-expires:${expiresIn}\n`;
  const signedHeaderNames = 'x-op-date;x-op-expires';
  const bodyHash = sha256Hex(body);

  const canonicalRequest = [
    method.toUpperCase(),
    uri,
    queryString,
    canonicalHeaders,
    signedHeaderNames,
    bodyHash,
  ].join('\n');

  const scope = `${date}/onepay/paycollect/ows1_request`;
  const stringToSign = [
    'OWS1-HMAC-SHA256',
    timestamp,
    scope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const signingKey = deriveSigningKey(secretKey, date);
  const expectedSig = toHex(hmacSha256(signingKey, stringToSign));

  // ── Extract received signature ────────────────────────────────────────────
  const sigMatch = receivedAuth.match(/Signature=([0-9a-f]+)/i);
  if (!sigMatch) return false;
  const receivedSig = sigMatch[1];

  // ── Constant-time comparison ──────────────────────────────────────────────
  const aBuffer = Buffer.from(expectedSig, 'hex');
  const bBuffer = Buffer.from(receivedSig, 'hex');
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}
