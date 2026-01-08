import { Browser } from "puppeteer";
import * as xlsx from "xlsx";
import { PuppeteerClient } from "./puppeteer-client";
import { excelLinkCache } from "../../lib/cache";
import { fiscalYearToTimestamp } from "../../lib/time";

const PBO_DATA_PORTAL_URL =
  "https://www.pbo.gov.au/publications-and-data/data-and-tools/data-portal/historical-fiscal-data";

/**
 * Scrapes the PBO Historical Fiscal Data page to find the URL of the most recent data file.
 * @returns The absolute URL of the latest historical fiscal data Excel file.
 */
export async function getLatestPboHistoricalFiscalDataLink(): Promise<string | null> {
  const cacheKey = "pbo:latest";
  // Try to get from cache first
  const cachedLink = excelLinkCache.get(cacheKey);
  if (cachedLink) {
    console.log(`[PBO] Using cached link: ${cachedLink}`);
    return cachedLink;
  }

  let browser: Browser | null = null;

  try {
    browser = await PuppeteerClient.launchBrowser();
    const page = await PuppeteerClient.createPage(browser);

    console.log(`[PBO] Navigating to ${PBO_DATA_PORTAL_URL}...`);
    await page.goto(PBO_DATA_PORTAL_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for the table to be visible
    console.log("[PBO] Waiting for data table...");
    await page.waitForSelector("table", { timeout: 30000 });

    // The latest data is usually in the first row of the table
    const latestLink = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      if (rows.length === 0) return null;

      const firstRow = rows[0];
      const linkElement = firstRow.querySelector('a[href*=".xlsx"], a[href*=".xls"]');

      if (linkElement && linkElement instanceof HTMLAnchorElement) {
        return linkElement.href;
      }

      return null;
    });

    if (!latestLink) {
      console.warn("[PBO] Could not find any data links in the table.");
      return null;
    }

    console.log(`[PBO] Found latest link: ${latestLink}`);

    // Save to cache (24 hours TTL)
    excelLinkCache.set(cacheKey, latestLink);

    return latestLink;
  } catch (error) {
    console.error("[PBO] Error getting latest historical fiscal data link:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Extracts indicator data from a specific PBO Excel sheet.
 * @param wb The workbook instance
 * @param sheetName The sheet name (e.g., "Table 1")
 * @param indicatorLabel The label in the first column (e.g., "Nominal GDP")
 * @returns Array of data points with year, timestamp, and value
 */
export function extractIndicatorDataFromPboAus(
  wb: xlsx.WorkBook,
  sheetName: string,
  indicatorLabel: string
) {
  if (!wb.SheetNames.includes(sheetName)) {
    console.error(`[PBO] Sheet "${sheetName}" not found.`);
    return null;
  }

  const worksheet = wb.Sheets[sheetName];
  const data: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Detect the row containing budget years (YYYY-YY pattern)
  let yearRowIndex = -1;
  let maxYearCount = 0;

  data.forEach((row, index) => {
    const yearCount = row.filter(
      (cell) => typeof cell === "string" && /^\d{4}-\d{2}$/.test(cell)
    ).length;
    if (yearCount > maxYearCount) {
      maxYearCount = yearCount;
      yearRowIndex = index;
    }
  });

  if (yearRowIndex === -1) {
    console.error(`[PBO] [${sheetName}] Could not find year row.`);
    return null;
  }

  const yearRow = data[yearRowIndex];
  const indicatorRow = data.find((row) => row[0]?.toString().trim() === indicatorLabel);

  if (!indicatorRow) {
    console.error(`[PBO] [${sheetName}] Could not find indicator: "${indicatorLabel}"`);
    return null;
  }

  const firstYearIndex = yearRow.findIndex(
    (cell) => typeof cell === "string" && /^\d{4}-\d{2}$/.test(cell)
  );
  const results: { year: string; timestamp: number; value: number }[] = [];

  for (let i = firstYearIndex; i < yearRow.length; i++) {
    const yearStr = yearRow[i];
    const value = indicatorRow[i];
    if (yearStr && typeof value === "number") {
      results.push({
        year: yearStr,
        timestamp: fiscalYearToTimestamp(yearStr),
        value,
      });
    }
  }
  console.log("results", results.slice(-10));
  
  return results;
}
