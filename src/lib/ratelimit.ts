import { LRUCache } from 'lru-cache';

interface RateLimitConfig {
  limit: number;
  window: number;
}

class RateLimit {
  private cache: LRUCache<string, number[]>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(config: RateLimitConfig) {
    this.maxRequests = config.limit;
    this.windowMs = config.window * 1000;

    this.cache = new LRUCache({
      max: 10000,
      ttl: this.windowMs
    });
  }

  public async limit(identifier: string) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let timestamps = this.cache.get(identifier) || [];

    timestamps = timestamps.filter((time) => time > windowStart);

    const isAllowed = timestamps.length < this.maxRequests;

    if (isAllowed) {
      timestamps.push(now);
      this.cache.set(identifier, timestamps);
    }

    return {
      success: isAllowed,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - timestamps.length),
      reset:
        timestamps.length > 0
          ? timestamps[0] + this.windowMs
          : now + this.windowMs
    };
  }
}

export const ratelimit = new RateLimit({
  limit: 30,
  window: 10
});

export const loginRatelimit = new RateLimit({
  limit: 5,
  window: 300
});

export const hubTokenRatelimit = new RateLimit({
  limit: 100,
  window: 100
});

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
