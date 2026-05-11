import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { UserMenu } from '@/features/auth/components/user-menu';

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Link href="/dashboard" className="font-semibold tracking-tight">
        {siteConfig.name}
      </Link>
      <UserMenu />
    </header>
  );
}
