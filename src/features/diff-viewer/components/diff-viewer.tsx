'use client';

import { useQuery } from '@tanstack/react-query';

import { useReviewStore } from '@/stores/review-store';

import { DiffEmptyState } from './diff-empty-state';

export function DiffViewer({
  org,
  repo,
  prNumber,
}: {
  org: string;
  repo: string;
  prNumber: number;
}) {
  const activeFilePath = useReviewStore((s) => s.activeFilePath);

  const { data, isFetching } = useQuery({
    queryKey: ['pr-diff', org, repo, prNumber, activeFilePath],
    enabled: !!activeFilePath,
    queryFn: async () => {
      const path = encodeURIComponent(activeFilePath!);
      const res = await fetch(
        `/api/github/${org}/${repo}/pull/${prNumber}/diff?path=${path}`,
      );
      if (!res.ok) throw new Error('Failed to load diff');
      return res.json() as Promise<{ hunks: unknown[] }>;
    },
  });

  if (!activeFilePath) {
    return <DiffEmptyState />;
  }

  if (isFetching && !data) {
    return <p className="p-4 text-sm text-muted-foreground">Loading diff…</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b px-4 py-2 text-xs text-muted-foreground">{activeFilePath}</div>
      <pre className="max-h-[calc(100vh-8rem)] flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed">
        {JSON.stringify(data?.hunks ?? [], null, 2)}
      </pre>
    </div>
  );
}
