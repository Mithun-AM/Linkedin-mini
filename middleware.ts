import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const PROTECTED_ROUTES = [
    '/api/posts/create', 
    '/api/auth/me',      
    '/api/users/'    
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  const isProtectedRoute = PROTECTED_ROUTES.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('X-User-Id', payload.id as string);

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

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};