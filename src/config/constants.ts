export const CACHE_TTL = {
  PR_METADATA: 5 * 60,
  FILE_LIST: 5 * 60,
  FILE_CONTENT_BY_SHA: 0,
  DIFF_BY_SHA: 0,
} as const;

export const RATE_LIMITS = {
  AI_REQUESTS_PER_MINUTE: 10,
  GITHUB_PROXY_PER_MINUTE: 100,
} as const;

export const IMPACT_THRESHOLDS = {
  HIGH_LINE_COUNT: 200,
  LOW_LINE_COUNT: 10,
} as const;

export const AI = {
  MAX_CONTEXT_TOKENS: 100_000,
  SURROUNDING_LINES: 200,
  MODEL: 'gemini-2.0-flash',
} as const;
