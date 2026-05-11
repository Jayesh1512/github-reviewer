import type { FileTreeNode } from '../types';

/** Reserved for richer nesting; pass-through for flat categorized trees. */
export function buildTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes;
}
