import type { ReactNode } from 'react';

export function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-1">
      <aside className="hidden w-72 shrink-0 border-r md:block">{sidebar}</aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
