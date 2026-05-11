'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';
import { useReviewStore } from '@/stores/review-store';

export function FileTreeNode({
  path,
  children,
}: {
  path: string;
  children?: ReactNode;
}) {
  const activeFilePath = useReviewStore((s) => s.activeFilePath);
  const setActiveFilePath = useReviewStore((s) => s.setActiveFilePath);
  const active = activeFilePath === path;

  return (
    <button
      type="button"
      onClick={() => setActiveFilePath(path)}
      className={cn(
        'flex w-full items-center rounded-md px-2 py-1 text-left text-xs hover:bg-accent',
        active && 'bg-accent font-medium',
      )}
    >
      {children ?? <span className="truncate">{path}</span>}
    </button>
  );
}
