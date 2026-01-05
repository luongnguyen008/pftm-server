import { IndicatorValue } from "../types";

/**
 * In-memory caching layer to reduce database load and improve performance
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

/**
 * Generic in-memory cache with TTL support
 */
export class InMemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  /**
   * Get cached value by key
   *
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with TTL
   *
   * @param key Cache key
   * @param data Data to cache
   * @param ttlMs Time to live in milliseconds
   */
  set(key: string, data: T, ttlMs: number): void {
    const expires = Date.now() + ttlMs;
    this.cache.set(key, { data, expires });
  }

  /**
   * Clear specific key from cache
   *
   * @param key Cache key to clear
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   *
   * @returns Number of entries in cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired entries from cache
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

/**
 * Pre-configured cache instance for indicator data
 * TTL: 1 hour (3600000 ms)
 */
export const indicatorCache = new InMemoryCache<IndicatorValue[]>();

/**
 * Helper to generate cache key for indicators
 *
 * @param country Country code
 * @param indicatorType Indicator type
 * @returns Cache key string
 */
export const getIndicatorCacheKey = (country: string, indicatorType: string): string => {
  return `${country}:${indicatorType}`;
};
