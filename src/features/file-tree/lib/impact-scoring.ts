import type { PRFile } from '@/types/pr';

import { IMPACT_THRESHOLDS } from '@/config/constants';

import { isLowImpactPath } from './file-patterns';

export type ImpactLevel = 'high' | 'medium' | 'low';

export function scoreImpact(file: PRFile): ImpactLevel {
  if (isLowImpactPath(file.path)) return 'low';

  const delta = file.additions + file.deletions;
  if (file.status === 'added' || file.status === 'removed') return 'high';
  if (delta > IMPACT_THRESHOLDS.HIGH_LINE_COUNT) return 'high';
  if (delta < IMPACT_THRESHOLDS.LOW_LINE_COUNT) return 'low';
  return 'medium';
}
