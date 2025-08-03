// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// ✨ Define protected routes by their base path.
const PROTECTED_ROUTES = [
    '/api/posts/create', // You can be specific
    '/api/auth/me',      // Or protect whole directories like below
    '/api/users/'        // Note the trailing slash to protect everything under /users/
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  // ✨ A simpler, more reliable check.
  const isProtectedRoute = PROTECTED_ROUTES.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('X-User-Id', payload.id as string);

      // Pass the modified request with the new header to the API route
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      console.error("JWT Verification Error:", err);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  }

  // If the route is not protected, just continue
  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware runs for all potential API routes.
  // The logic inside the middleware then determines which ones are actually protected.
  matcher: '/api/:path*',
};