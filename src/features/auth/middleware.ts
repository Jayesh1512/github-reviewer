/**
 * Route patterns protected by auth middleware (see root `middleware.ts`).
 */
export const authMiddlewareMatcher = [
  '/dashboard/:path*',
  '/settings/:path*',
  '/:org/:repo/pull/:path*',
];
