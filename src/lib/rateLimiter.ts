/**
 * Rate Limiter - Client-side rate limiting and request throttling
 * Protects against abuse and excessive API calls
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: 'ratelimit',
      ...config,
    };

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(key: string): boolean {
    const fullKey = `${this.config.keyPrefix}:${key}`;
    const now = Date.now();
    const entry = this.limits.get(fullKey);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.limits.set(fullKey, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (entry.count < this.config.maxRequests) {
      // Within limit
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const fullKey = `${this.config.keyPrefix}:${key}`;
    const entry = this.limits.get(fullKey);

    if (!entry || Date.now() > entry.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Get time until reset (in ms)
   */
  getResetTime(key: string): number {
    const fullKey = `${this.config.keyPrefix}:${key}`;
    const entry = this.limits.get(fullKey);

    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }

    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.limits.forEach((entry, key) => {
      if (now > entry.resetTime) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => this.limits.delete(key));
  }

  /**
   * Reset a specific key
   */
  reset(key: string): void {
    const fullKey = `${this.config.keyPrefix}:${key}`;
    this.limits.delete(fullKey);
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.limits.clear();
  }
}

// Pre-configured rate limiters for different use cases

// API calls - 100 requests per minute per endpoint
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyPrefix: 'api',
});

// Authentication - 5 attempts per 15 minutes
export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60000, // 15 minutes
  keyPrefix: 'auth',
});

// Form submissions - 10 per 5 minutes
export const formRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 5 * 60000, // 5 minutes
  keyPrefix: 'form',
});

// Email sending - 3 per hour
export const emailRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60000, // 1 hour
  keyPrefix: 'email',
});

// File uploads - 20 per hour
export const uploadRateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60 * 60000, // 1 hour
  keyPrefix: 'upload',
});

/**
 * Middleware-style rate limiting wrapper
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limiter: RateLimiter,
  getKey: (...args: Parameters<T>) => string
): T {
  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);

    if (!limiter.isAllowed(key)) {
      const resetTime = limiter.getResetTime(key);
      const resetMinutes = Math.ceil(resetTime / 60000);

      throw new Error(
        `Rate limit exceeded. Please try again in ${resetMinutes} minute(s).`
      );
    }

    return fn(...args);
  }) as T;
}

/**
 * Get user identifier for rate limiting
 * Uses multiple factors for better tracking
 */
export function getUserKey(userId?: string): string {
  const factors = [
    userId || 'anonymous',
    // Note: fingerprinting should be done carefully to respect privacy
    window.navigator.userAgent,
    window.screen.width + 'x' + window.screen.height,
  ];

  // Simple hash function
  const hash = factors.join('|').split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  return Math.abs(hash).toString(36);
}

export default RateLimiter;
