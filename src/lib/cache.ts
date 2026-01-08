import fs from "fs";
import path from "path";

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
   * Check if cache has key and it's not expired
   *
   * @param key Cache key
   * @returns True if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

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
 * Persistent dictionary-style cache that stores multiple keys in a single file.
 * Format: { [key: string]: { data: T, expires: number } }
 */
export class PersistentDictionaryCache<T> {
  private cacheDir: string;
  private cacheFile: string;

  constructor(filename: string) {
    this.cacheDir = path.join(process.cwd(), ".cache");
    this.cacheFile = path.join(this.cacheDir, filename);

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private readCache(): Record<string, CacheEntry<T>> {
    if (!fs.existsSync(this.cacheFile)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.cacheFile, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error(`[CACHE] Error reading dictionary cache ${this.cacheFile}:`, error);
      return {};
    }
  }

  private writeCache(cache: Record<string, CacheEntry<T>>): void {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2));
    } catch (error) {
      console.error(`[CACHE] Error writing dictionary cache ${this.cacheFile}:`, error);
    }
  }

  /**
   * Get cached value by key
   */
  get(key: string): T | null {
    const cache = this.readCache();
    const entry = cache[key];

    if (!entry) return null;

    if (Date.now() > entry.expires) {
      delete cache[key];
      this.writeCache(cache);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached value by key
   */
  set(key: string, data: T, ttlMs: number = 24 * 60 * 60 * 1000): void {
    const cache = this.readCache();
    cache[key] = {
      data,
      expires: Date.now() + ttlMs,
    };
    this.writeCache(cache);
  }

  /**
   * Clear all entries or specific key
   */
  clear(key?: string): void {
    if (key) {
      const cache = this.readCache();
      delete cache[key];
      this.writeCache(cache);
    } else if (fs.existsSync(this.cacheFile)) {
      fs.unlinkSync(this.cacheFile);
    }
  }
}

/**
 * Global persistent cache for Excel links
 * Consolidates all links into .cache/excel-link.json
 */
export const excelLinkCache = new PersistentDictionaryCache<string>("excel-link.json");
