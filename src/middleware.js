import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

const protectedRoutes = [
  '/dashboard',
  '/backtester',
  '/strategies',
  '/trades',
  '/analytics',
  '/settings',
];

const authRoutes = ['/login', '/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let verifiedToken = null;
  if (token) {
    verifiedToken = await verifyJWT(token);
  }

  if (isProtectedRoute && !verifiedToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && verifiedToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/backtester/:path*',
    '/strategies/:path*',
    '/trades/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};