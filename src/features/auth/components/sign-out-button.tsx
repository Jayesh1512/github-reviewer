'use client';

import type { ComponentProps } from 'react';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export function SignOutButton({
  variant = 'ghost',
}: {
  variant?: ComponentProps<typeof Button>['variant'];
}) {
  return (
    <Button type="button" variant={variant} size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign out
    </Button>
  );
}
