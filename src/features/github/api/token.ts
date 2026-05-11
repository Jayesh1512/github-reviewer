import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

import { env } from '@/env';

/**
 * On HTTPS (Vercel, etc.), Auth.js sets `__Secure-authjs.session-token`.
 * `getToken` must use `secureCookie: true` or it looks for the wrong cookie name and returns null.
 */
function secureCookieForGetToken(req?: NextRequest): boolean {
  if (req) {
    const proto = req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '');
    if (proto === 'https') return true;
  }
  if (process.env.VERCEL === '1') return true;
  if (env.NEXTAUTH_URL.startsWith('https://')) return true;
  return false;
}

/**
 * GitHub REST API token from the encrypted JWT (server-only — never expose to the browser).
 */
export async function getGitHubAccessToken(req: NextRequest): Promise<string | null> {
  const token = await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
    secureCookie: secureCookieForGetToken(req),
  });
  const access = token?.githubAccessToken;
  return typeof access === 'string' ? access : null;
}

/** Use inside Server Components / server actions where there is no Request object. */
export async function getGitHubAccessTokenFromCookies(): Promise<string | null> {
  const h = await headers();
  const proto = h.get('x-forwarded-proto');
  const secureCookie = proto === 'https' || secureCookieForGetToken();

  const token = await getToken({
    req: { headers: Object.fromEntries(h.entries()) },
    secret: env.NEXTAUTH_SECRET,
    secureCookie,
  });
  const access = token?.githubAccessToken;
  return typeof access === 'string' ? access : null;
}
