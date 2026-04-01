import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ADMIN_PATHS = new Set([
  '/admin/login',
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Keep middleware lightweight for edge runtime: only check cookie existence.
  // Full JWT validation is enforced in API routes via requireAdminSession().
  const token = request.cookies.get('admin_session')?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
