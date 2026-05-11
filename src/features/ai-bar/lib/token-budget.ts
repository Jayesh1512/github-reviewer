import { AI } from '@/config/constants';

/** Rough token estimate (4 chars ≈ 1 token). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function trimToBudget(parts: string[], maxTokens = AI.MAX_CONTEXT_TOKENS): string {
  const target = maxTokens * 4;
  let out = '';
  for (const p of parts) {
    if (out.length + p.length > target) break;
    out += p;
  }
  return out;
}
