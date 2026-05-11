import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Authentication error</h1>
      <p className="text-sm text-muted-foreground">
        {error ? `Error: ${error}` : 'Sign in was cancelled or failed.'}
      </p>
      <Button asChild>
        <Link href="/login">Try again</Link>
      </Button>
    </div>
  );
}
