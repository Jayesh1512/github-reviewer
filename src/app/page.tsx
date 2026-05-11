import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { auth } from '@/features/auth/auth';

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-3 text-muted-foreground">{siteConfig.description}</p>
      </div>
      <Button size="lg" asChild>
        <Link href="/login">Sign in with GitHub</Link>
      </Button>
    </div>
  );
}
