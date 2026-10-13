import { createHmac, timingSafeEqual } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

export const ADMIN_COOKIE = 'phonehub_admin';

export function isValidAdminSession(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now() / 1000) return false;
  const expected = createHmac('sha256', secret).update(expiresAt).digest('base64url');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isValidAdminSession(req.headers.cookie?.match(/(?:^|;\s*)phonehub_admin=([^;]+)/)?.[1])) {
    return res.status(401).json({ error: 'Admin access required' });
  }
  return next();
}