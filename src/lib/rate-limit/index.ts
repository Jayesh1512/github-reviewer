import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';
import { RATE_LIMITS } from '@/config/constants';

export const aiRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.AI_REQUESTS_PER_MINUTE, '1 m'),
      prefix: 'ratelimit:ai',
    })
  : null;

export const githubProxyRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.GITHUB_PROXY_PER_MINUTE, '1 m'),
      prefix: 'ratelimit:gh',
    })
  : null;
