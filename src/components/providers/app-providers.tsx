'use client';

import type { Session } from 'next-auth';
import { Toaster } from 'sonner';

import { KeyboardProvider } from '@/features/keyboard/keyboard-provider';

import { QueryProvider } from './query-provider';
import { SessionProvider } from './session-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <QueryProvider>
          <KeyboardProvider>
            {children}
            <Toaster richColors position="top-center" />
          </KeyboardProvider>
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
