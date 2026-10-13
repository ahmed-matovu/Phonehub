import { NextRequest, NextResponse } from 'next/server';

async function hasValidAdminSession(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !/^[A-Za-z0-9_-]{43}$/.test(signature) || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now() / 1000) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const base64Signature = signature.replace(/-/g, '+').replace(/_/g, '/');
  const signatureBytes = Uint8Array.from(atob(base64Signature + '='.repeat((4 - base64Signature.length % 4) % 4)), (character) => character.charCodeAt(0));
  return crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(expiresAt));
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();
  if (await hasValidAdminSession(request.cookies.get('phonehub_admin')?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = { matcher: ['/admin/:path*'] };