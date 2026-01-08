/**
 * API Client with automatic retry logic and exponential backoff
 *
 * Features:
 * - Automatic retry on transient failures (network errors, 5xx)
 * - Rate limit handling (HTTP 429) with exponential backoff
 * - Configurable max retries and delay
 */

/**
 * Custom error class for HTTP client errors (4xx)
 * These errors should NOT be retried
 */
import pc from "picocolors";

class HttpClientError extends Error {
  constructor(
    public status: number,
    public statusText: string
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpClientError";
  }
}

/**
 * Sleep utility for adding delays
 * @param ms Milliseconds to sleep
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Fetch with automatic retry logic
 *
 * @param url The URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries (default: 3)
 * @param initialDelayMs Initial delay in milliseconds (default: 1000)
 * @returns Response from fetch
 *
 * @example
 * const response = await fetchWithRetry(
 *   'https://api.example.com/data',
 *   { method: 'GET' },
 *   3,
 *   1000
 * );
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<Response> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Success - return immediately
      if (response.ok) {
        if (attempt > 0) {
          console.log(`[RETRY] Success after ${attempt} retries for ${url}`);
        }
        return response;
      }

      // Rate limited - use exponential backoff
      if (response.status === 429) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        console.warn(
          `[RETRY] Rate limited (429), waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`
        );
        await sleep(delay);
        continue;
      }

      // Server error (5xx) - retry with backoff
      if (response.status >= 500) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        console.warn(
          `[RETRY] Server error (${response.status}), waiting ${delay}ms before retry ${
            attempt + 1
          }/${maxRetries}`
        );
        await sleep(delay);
        continue;
      }

      // Client error (4xx, not 429) - don't retry, throw immediately
      throw new HttpClientError(response.status, response.statusText);
    } catch (error) {
      lastError = error as Error;

      // If it's an HTTP client error (4xx), don't retry - fail immediately
      if (error instanceof HttpClientError) {
        console.error(pc.yellowBright(`[RETRY] Client error (${error.status}), not retrying: ${error.message}`));
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Network error or other transient error - retry with delay
      const delay = initialDelayMs * Math.pow(2, attempt);
      console.warn(
        `[RETRY] Network error, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}:`,
        error instanceof Error ? error.message : String(error)
      );
      await sleep(delay);
    }
  }

  // All retries exhausted
  console.error(`[RETRY] Failed after ${maxRetries} attempts for ${url}`);
  throw lastError || new Error("All retry attempts failed");
};
