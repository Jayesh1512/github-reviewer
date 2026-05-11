import type { PRFile } from '@/types/pr';

import type { FileTreeNode } from '../types';
import { scoreImpact } from './impact-scoring';

export function categorizeFiles(files: PRFile[]): FileTreeNode[] {
  const map = new Map<string, PRFile[]>();

  for (const f of files) {
    const top = f.path.split('/')[0] ?? '(root)';
    const bucket = map.get(top) ?? [];
    bucket.push(f);
    map.set(top, bucket);
  }

  const nodes: FileTreeNode[] = [];
  for (const [dir, group] of [...map.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    nodes.push({
      type: 'group',
      id: dir,
      label: dir,
      children: group.map((file) => ({
        type: 'file',
        id: file.path,
        path: file.path,
        impact: scoreImpact(file),
      })),
    });
  }
  return nodes;
}
