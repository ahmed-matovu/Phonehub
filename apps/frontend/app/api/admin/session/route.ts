import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createAdminSession, verifyAdminSession } from '../../../../lib/admin-session';
import { timingSafeEqual } from 'node:crypto';

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value) });
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12 || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return NextResponse.json({ error: 'Admin access is not configured on the server' }, { status: 503 });
  }
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== 'string' || body.password.length > 256) {
    return NextResponse.json({ error: 'Enter the admin password' }, { status: 400 });
  }
  const expected = Buffer.from(adminPassword);
  const received = Buffer.from(body.password);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}