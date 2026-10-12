import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/backtester',
  '/strategies',
  '/trades',
  '/analytics',
  '/settings',
  '/positions'
];

const AUTH_ROUTES = ['/login', '/register'];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tradelab_super_secret_jwt_key_2025_prod_secure'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  let isValidToken = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch (err) {
      isValidToken = false;
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);

    const response = NextResponse.redirect(loginUrl);
    if (token && !isValidToken) {
      response.cookies.delete('token');
    }
    return response;
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/backtester',
    '/backtester/:path*',
    '/strategies',
    '/strategies/:path*',
    '/trades',
    '/trades/:path*',
    '/analytics',
    '/analytics/:path*',
    '/settings',
    '/settings/:path*',
    '/positions',
    '/positions/:path*',
    '/login',
    '/register'
  ]
};