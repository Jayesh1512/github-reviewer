'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export function FileTreeGroup({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground hover:bg-accent',
        )}
      >
        {label}
        <span className="text-[10px]">{open ? '▾' : '▸'}</span>
      </button>
      {open ? <div className="ml-1 border-l pl-1">{children}</div> : null}
    </div>
  );
}
