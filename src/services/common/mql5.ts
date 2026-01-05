import { Browser, Page } from "puppeteer";
import { numberFormatter } from "../../lib/number-formatter";
import { PuppeteerClient } from "./puppeteer-client";
import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
} from "../../types";

interface MQL5DataPoint {
  timestamp: number; // Unix timestamp in seconds
  actual: number;
  actual_formatted: string;
  forecast: number;
  forecast_formatted: string;
}

/**
 * Get the total number of pages from the pagination
 * @param page - Puppeteer page instance
 * @returns Total number of pages
 */
async function getTotalPages(page: Page): Promise<number> {
  try {
    // Find all pagination links
    const paginationLinks = await page.$$(".paginatorEx a");

    if (paginationLinks.length === 0) {
      // If no pagination, there's only 1 page
      return 1;
    }

    return paginationLinks.length;
  } catch (error) {
    console.error("Error getting total pages:", error);
    return 1;
  }
}

/**
 * Fetch data from the current page
 * @param page - Puppeteer page instance
 * @returns Array of data points from this page
 */
async function fetchPageData(page: Page): Promise<MQL5DataPoint[]> {
  try {
    // Wait for the event history to load
    await page.waitForSelector("#eventHistory", { timeout: 10000 });

    // Extract data from all items on the page
    const data = await page.$$eval("#eventHistory .event-table-history__item", (items) => {
      const results: Array<{
        timestamp: number;
        actual: string;
        forecast: string;
        period: string;
      }> = [];

      items.forEach((item) => {
        // Get the period text - for filtering
        const periodElement = item.querySelector(".event-table-history__period");
        const period = periodElement?.textContent?.trim() || "";

        // Skip preliminary data
        if (period.includes("prelim")) {
          return;
        }

        // Get timestamp from data-date attribute (in milliseconds)
        const dateElement = item.querySelector(".event-table-history__date");
        const dataDateMs = dateElement?.getAttribute("data-date");

        if (!dataDateMs) {
          return;
        }

        // Convert from milliseconds to seconds (Unix timestamp)
        const timestamp = Math.floor(parseInt(dataDateMs, 10) / 1000);

        if (isNaN(timestamp)) {
          return;
        }

        // Get the actual value text
        const actualValueElement = item.querySelector(".event-table-history__actual__value");
        const actualValueText = actualValueElement?.textContent?.trim() || "";

        // Get the forecast value text
        const forecastElement = item.querySelector(".event-table-history__forecast");
        const forecastValueText = forecastElement?.textContent?.trim() || "";

        results.push({
          timestamp,
          actual: actualValueText,
          forecast: forecastValueText,
          period,
        });
      });

      return results;
    });

    // Process the data and convert to proper format
    const eventHistoryItems: MQL5DataPoint[] = [];

    for (const item of data) {
      const actualValue = parseFloat(item.actual);
      const forecastValue = parseFloat(item.forecast);

      // Validate that we have numeric values for actual
      if (isNaN(actualValue)) {
        continue;
      }

      // Format values with 1 decimal place
      const formattedActual = numberFormatter(actualValue, { decimals: 1 });
      const formattedForecast = !isNaN(forecastValue)
        ? numberFormatter(forecastValue, { decimals: 1 })
        : "";

      eventHistoryItems.push({
        timestamp: item.timestamp,
        actual: actualValue,
        actual_formatted: formattedActual,
        forecast: forecastValue || 0,
        forecast_formatted: formattedForecast,
      });
    }

    return eventHistoryItems;
  } catch (error) {
    console.error(`Error fetching page data:`, error);
    return [];
  }
}

/**
 * Fetch all historical data from MQL5 economic calendar using Puppeteer
 * @param baseUrl - The base URL (e.g., "https://www.mql5.com/en/economic-calendar/australia/commonwealth-bank-manufacturing-pmi")
 * @returns Array of all data points across all pages
 */
export async function fetchMQL5History(baseUrl: string): Promise<MQL5DataPoint[]> {
  let browser: Browser | null = null;

  try {
    browser = await PuppeteerClient.launchBrowser();
    const page = await PuppeteerClient.createPage(browser);

    // NOTE: Optimization - Go straight to history page 1
    // Navigate to the base URL first to get pagination info
    const firstPageUrl = `${baseUrl}/history?page=1`;
    await page.goto(firstPageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Get total number of pages from the first page
    const totalPages = await getTotalPages(page);

    const allData: MQL5DataPoint[] = [];

    // Fetch data from page 1 immediately
    const page1Data = await fetchPageData(page);
    allData.push(...page1Data);

    if (totalPages > 1) {
      // Create a queue of pages to fetch
      const pagesToFetch = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

      // Process in chunks to avoid opening too many tabs
      const CONCURRENCY_LIMIT = 5;

      for (let i = 0; i < pagesToFetch.length; i += CONCURRENCY_LIMIT) {
        const chunk = pagesToFetch.slice(i, i + CONCURRENCY_LIMIT);

        const batchPromises = chunk.map(async (pageNum) => {
          let pageTab: Page | null = null;
          try {
            if (!browser) throw new Error("Browser closed");
            pageTab = await PuppeteerClient.createPage(browser);

            const pageUrl = `${baseUrl}/history?page=${pageNum}`;
            await pageTab.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            const data = await fetchPageData(pageTab!);
            return data;
          } catch (err) {
            console.error(`Error fetching page ${pageNum}:`, err);
            return [];
          } finally {
            if (pageTab) await pageTab.close();
          }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach((data) => allData.push(...data));
      }
    }
    // Sort by timestamp (oldest to newest)
    const sortedData = allData.sort((a, b) => a.timestamp - b.timestamp);

    return sortedData;
  } catch (error) {
    console.error("Error fetching MQL5 history:", error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

interface IMQL5Indicator {
  url: string;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  frequency: FREQUENCY;
  unit?: UNIT;
  currency?: Currency;
}

// Fetch all historical data from MQL5 economic calendar using Puppeteer
export const fetchMQL5Data = async (indicator: IMQL5Indicator): Promise<IndicatorValue[]> => {
  const history = await fetchMQL5History(indicator.url);

  return history.map((item: MQL5DataPoint) => {
    return {
      country: indicator.country,
      indicator_type: indicator.indicatorType,
      frequency: indicator.frequency,
      timestamp: item.timestamp,
      actual: isNaN(Number(item.actual)) ? 0 : Number(item.actual),
      actual_formatted: item.actual_formatted,
      forecast: isNaN(Number(item.forecast)) ? 0 : Number(item.forecast),
      forecast_formatted: item.forecast_formatted,
      unit: indicator.unit,
      currency: indicator.currency,
    };
  });
};
