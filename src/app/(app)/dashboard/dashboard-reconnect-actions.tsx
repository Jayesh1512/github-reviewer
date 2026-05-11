'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/features/auth/components/sign-out-button';

export function DashboardReconnectActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button asChild>
        <Link href="/login?callbackUrl=%2Fdashboard">Sign in with GitHub</Link>
      </Button>
      <SignOutButton variant="outline" />
    </div>
  );
}
