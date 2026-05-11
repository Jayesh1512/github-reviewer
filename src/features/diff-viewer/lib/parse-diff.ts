import type { Hunk, DiffLine } from '../types';

/** Minimal patch parser — replace with full unified-diff parsing as needed. */
export function parsePatch(patch: string): Hunk[] {
  const lines = patch.split(/\r?\n/);
  const hunks: Hunk[] = [];
  let current: Hunk | null = null;
  let lineIdx = 0;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      if (current) hunks.push(current);
      current = {
        index: hunks.length,
        header: line,
        lines: [],
      };
      continue;
    }
    if (!current) continue;

    let type: DiffLine['type'] = 'context';
    let content = line;
    if (line.startsWith('+') && !line.startsWith('+++')) {
      type = 'addition';
      content = line.slice(1);
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      type = 'deletion';
      content = line.slice(1);
    }

    current.lines.push({
      id: `${current.index}-${lineIdx++}`,
      type,
      oldLineNumber: null,
      newLineNumber: null,
      content,
    });
  }
  if (current) hunks.push(current);
  return hunks;
}
