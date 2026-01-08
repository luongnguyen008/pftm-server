import puppeteer, { Browser, Page } from "puppeteer";
import { logger } from "../../lib/logger";

export class PuppeteerClient {
  /**
   * Launch a browser instance with optimized settings
   */
  static async launchBrowser(): Promise<Browser> {
    logger.info("Launching browser...", "PUPPETEER");
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
  }

  /**
   * Create a new page with optimizations (resource blocking, UA, viewport)
   */
  static async createPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    // Disable images and CSS to speed up page loads
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (request.isInterceptResolutionHandled()) return;
      if (resourceType === "image" || resourceType === "stylesheet" || resourceType === "font") {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    return page;
  }
}
