export type ViewMode = 'unified' | 'split';

export type DiffSide = 'LEFT' | 'RIGHT';

export type LineType = 'addition' | 'deletion' | 'context' | 'hunk-header';

export interface DiffLine {
  id: string;
  type: LineType;
  oldLineNumber: number | null;
  newLineNumber: number | null;
  content: string;
}

export interface Hunk {
  index: number;
  header: string;
  lines: DiffLine[];
}
