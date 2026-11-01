// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLES_INTERNAL = ['ADMIN', 'NHAN_VIEN']; // Đã đổi cho khớp Backend

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;
  const token = request.cookies.get('access_token')?.value;

  // 1) Đã login mà vào /login hoặc /register → đá về trang theo role
  if ((pathname === '/login' || pathname === '/register') && token && role) {
    const dest = role === 'KHACH_HANG' ? '/' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 2) Vào /dashboard mà chưa login → về /login
  if (pathname.startsWith('/dashboard')) {
    if (!token || !role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role === 'KHACH_HANG') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (!ROLES_INTERNAL.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3) Vào trang chủ / mà là role nội bộ → đá về /dashboard
  if (pathname === '/') {
    if (token && role && role !== 'KHACH_HANG') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};