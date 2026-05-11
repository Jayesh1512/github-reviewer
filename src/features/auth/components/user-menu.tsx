'use client';

import { Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

import { SignOutButton } from './sign-out-button';

export function UserMenu() {
  const { data } = useSession();
  if (!data?.user) return null;

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/settings">
          <Settings className="size-4" />
          Settings
        </Link>
      </Button>
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {data.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.user.image}
            alt=""
            className="size-8 rounded-full"
            width={32}
            height={32}
          />
        ) : (
          <User className="size-8 opacity-60" />
        )}
        {data.user.name ?? data.user.email}
      </span>
      <SignOutButton />
    </div>
  );
}
