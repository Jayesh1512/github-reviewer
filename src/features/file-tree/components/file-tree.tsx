'use client';

import { useQuery } from '@tanstack/react-query';

import type { FileTreeNode } from '../types';

import { FileImpactBadge } from './file-impact-badge';
import { FileTreeGroup } from './file-tree-group';
import { FileTreeNode as FileRow } from './file-tree-node';
import { FileTreeSearch } from './file-tree-search';

export function FileTree({
  org,
  repo,
  prNumber,
}: {
  org: string;
  repo: string;
  prNumber: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pr-files', org, repo, prNumber],
    queryFn: async () => {
      const res = await fetch(`/api/github/${org}/${repo}/pull/${prNumber}/files`);
      if (!res.ok) throw new Error('Failed to load files');
      return res.json() as Promise<{ tree: FileTreeNode[] }>;
    },
  });

  if (isLoading) {
    return <p className="p-3 text-sm text-muted-foreground">Loading files…</p>;
  }
  if (error || !data?.tree) {
    return <p className="p-3 text-sm text-destructive">Could not load file tree.</p>;
  }

  return (
    <nav className="flex flex-col gap-1 p-2 text-sm" aria-label="Changed files">
      <FileTreeSearch value="" onChange={() => {}} className="mb-2" />
      {data.tree.map((node) =>
        node.type === 'group' ? (
          <FileTreeGroup key={node.id} label={node.label}>
            {node.children.map((child) => (
              <FileRow key={child.id} path={child.path}>
                <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
                  <span className="truncate">{child.path}</span>
                  <FileImpactBadge impact={child.impact} />
                </span>
              </FileRow>
            ))}
          </FileTreeGroup>
        ) : null,
      )}
    </nav>
  );
}
