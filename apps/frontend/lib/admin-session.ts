import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'phonehub_admin';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

export function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  const signature = createHmac('sha256', secret).update(expiresAt).digest('base64url');
  return `${expiresAt}.${signature}`;
}

export function verifyAdminSession(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now() / 1000) return false;
  const expected = createHmac('sha256', secret).update(expiresAt).digest('base64url');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}