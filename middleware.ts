import { NextResponse } from 'next/server';

import { auth } from '@/features/auth/auth';

export default auth((req) => {
  if (!req.auth) {
    const login = new URL('/login', req.nextUrl.origin);
    login.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
});

export const config = {
  // Note: `/dashboard/:path*` does NOT match `/dashboard` exactly — list `/dashboard` on its own.
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/settings',
    '/settings/:path*',
    '/:org/:repo/pull/:id',
  ],
};
