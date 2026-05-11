import type { DiffLine } from '../types';

export function isAddition(line: DiffLine): boolean {
  return line.type === 'addition';
}

export function isDeletion(line: DiffLine): boolean {
  return line.type === 'deletion';
}
