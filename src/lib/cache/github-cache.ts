import { redis } from '@/lib/redis';
import { CACHE_TTL } from '@/config/constants';

function key(parts: string[]): string {
  return `gh:${parts.join('/')}`;
}

export async function getCached<T>(parts: string[]): Promise<T | null> {
  if (!redis) return null;
  const raw = await redis.get<string>(key(parts));
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(
  parts: string[],
  value: T,
  ttlSeconds: number = CACHE_TTL.PR_METADATA,
): Promise<void> {
  if (!redis) return;
  const k = key(parts);
  const payload = JSON.stringify(value);
  if (ttlSeconds > 0) {
    await redis.set(k, payload, { ex: ttlSeconds });
  } else {
    await redis.set(k, payload);
  }
}

export async function invalidatePrefix(prefixParts: string[]): Promise<void> {
  if (!redis) return;
  const pattern = `${key(prefixParts)}*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
}
