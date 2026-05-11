'use client';

import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { DiffViewer } from '@/features/diff-viewer/components/diff-viewer';
import { FileTree } from '@/features/file-tree/components/file-tree';

export function PRReviewPage({
  org,
  repo,
  prNumber,
}: {
  org: string;
  repo: string;
  prNumber: number;
}) {
  return (
    <SidebarLayout sidebar={<FileTree org={org} repo={repo} prNumber={prNumber} />}>
      <DiffViewer org={org} repo={repo} prNumber={prNumber} />
    </SidebarLayout>
  );
}
