import { cn } from '@/lib/utils/cn';

import type { ImpactLevel } from '../lib/impact-scoring';

const styles: Record<ImpactLevel, string> = {
  high: 'bg-red-500/15 text-red-700 dark:text-red-300',
  medium: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  low: 'bg-muted text-muted-foreground',
};

export function FileImpactBadge({ impact }: { impact: ImpactLevel }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded px-1 py-0.5 text-[10px] font-medium uppercase',
        styles[impact],
      )}
    >
      {impact}
    </span>
  );
}
