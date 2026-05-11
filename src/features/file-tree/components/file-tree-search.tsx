'use client';

import { cn } from '@/lib/utils/cn';

/** Debounced filter — wire search state in `use-file-filter` later. */
export function FileTreeSearch({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      type="search"
      placeholder="Filter files…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'mb-2 w-full rounded-md border border-input bg-background px-2 py-1 text-xs',
        className,
      )}
    />
  );
}
