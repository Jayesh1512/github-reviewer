import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

import { env } from '@/env';

/**
 * GitHub REST API token from the encrypted JWT (server-only — never expose to the browser).
 */
export async function getGitHubAccessToken(req: NextRequest): Promise<string | null> {
  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
  const access = token?.githubAccessToken;
  return typeof access === 'string' ? access : null;
}

/** Use inside Server Components / server actions where there is no Request object. */
export async function getGitHubAccessTokenFromCookies(): Promise<string | null> {
  const h = await headers();
  const cookie = h.get('cookie') ?? '';
  const token = await getToken({
    req: { headers: { cookie } },
    secret: env.NEXTAUTH_SECRET,
  });
  const access = token?.githubAccessToken;
  return typeof access === 'string' ? access : null;
}
