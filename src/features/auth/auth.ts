import NextAuth from 'next-auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { authConfig } from '@/features/auth/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.githubAccessToken = account.access_token;
      }

      if (account && profile && typeof profile.id === 'number') {
        const { db } = await import('@/lib/db');
        const { users } = await import('@/lib/db/schema/users');

        const githubId = profile.id;
        const login = profile.login as string;
        const avatarUrl = (profile.avatar_url as string | undefined) ?? null;
        const email = (profile.email as string | undefined) ?? null;

        await db
          .insert(users)
          .values({
            githubId,
            githubLogin: login,
            avatarUrl: avatarUrl ?? undefined,
            email: email ?? undefined,
          })
          .onConflictDoUpdate({
            target: users.githubId,
            set: {
              githubLogin: login,
              avatarUrl: avatarUrl ?? undefined,
              email: email ?? undefined,
              updatedAt: new Date(),
            },
          });

        const [row] = await db
          .select()
          .from(users)
          .where(eq(users.githubId, githubId))
          .limit(1);
        if (row) token.appUserId = row.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.appUserId) {
        session.user.id = token.appUserId as string;
      }
      return session;
    },
  },
});

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session;
}
