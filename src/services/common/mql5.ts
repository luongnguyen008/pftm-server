import puppeteer, { Browser, Page } from "puppeteer";
import { numberFormatter } from "../../lib/number-formatter";

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

        console.log("Pagination links found:", paginationLinks.length);

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
                const actualValueElement = item.querySelector(
                    ".event-table-history__actual__value"
                );
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

        console.log(`Found ${data.length} items on this page`);

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
        console.log("Launching browser...");
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page = await browser.newPage();

        // Set a realistic user agent
        await page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate to the base URL first to get pagination info
        console.log("Navigating to base URL to get pagination...");
        console.log("Base URL:", baseUrl);
        await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 30000 });

        // Get total number of pages from the base page
        console.log("Getting total pages from pagination...");
        const totalPages = await getTotalPages(page);
        console.log(`Found ${totalPages} page(s) to fetch`);

        const allData: MQL5DataPoint[] = [];

        // Fetch all pages
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            console.log(`Fetching page ${pageNum}/${totalPages}...`);

            // Navigate to the history page
            const pageUrl = `${baseUrl}/history?page=${pageNum}`;
            console.log("Navigating to:", pageUrl);
            await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 30000 });

            // Fetch data from current page
            const pageData = await fetchPageData(page);
            allData.push(...pageData);

            // Add a small delay between pages
            if (pageNum < totalPages) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        console.log(`Total records fetched: ${allData.length}`);

        // Sort by timestamp (oldest to newest)
        return allData.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
        console.error("Error fetching MQL5 history:", error);
        return [];
    } finally {
        if (browser) {
            await browser.close();
            console.log("Browser closed");
        }
    }
}