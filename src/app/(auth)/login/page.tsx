import { redirect } from 'next/navigation';

import { SignInButton } from '@/features/auth/components/sign-in-button';
import { auth } from '@/features/auth/auth';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with GitHub to review pull requests.</p>
      </div>
      <SignInButton />
    </div>
  );
}
