// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const ORIGIN = 'https://serenity-peach.vercel.app';

// List of pages you want to protect with JWT
const PROTECTED_PATHS = [
  '/dashboard',
  '/Input1',
  '/Input2',
  '/journel',
  '/community',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) CORS for API routes
  if (pathname.startsWith('/api/')) {
    // Preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ORIGIN,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
           'Access-Control-Allow-Credentials': 'true'
        },
      });
    }

    // Real API request — inject CORS headers and continue
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', ORIGIN);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // 2) JWT auth for protected pages
  if (PROTECTED_PATHS.some((p) => pathname === p)) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      // No token → redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    try {
      await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      // valid → proceed
      return NextResponse.next();
    } catch {
      // invalid or expired → redirect
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // 3) Everything else — just continue
  return NextResponse.next();
}

export const config = {
  // Apply middleware to both API routes and your protected pages
  matcher: ['/api/:path*', ...PROTECTED_PATHS],
};
