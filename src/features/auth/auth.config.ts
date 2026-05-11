import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { env } from '@/env';

export const authConfig = {
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          // read:org — list org teams so we can find team-review-requested PRs
          scope: 'read:user user:email repo read:org',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth-error',
  },
  trustHost: true,
} satisfies NextAuthConfig;
