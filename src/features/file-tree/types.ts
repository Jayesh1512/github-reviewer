import type { ImpactLevel } from './lib/impact-scoring';

export type FileCategory = string;

export interface FileLeaf {
  type: 'file';
  id: string;
  path: string;
  impact: ImpactLevel;
}

export interface FileGroup {
  type: 'group';
  id: string;
  label: string;
  children: FileLeaf[];
}

export type FileTreeNode = FileGroup | FileLeaf;
