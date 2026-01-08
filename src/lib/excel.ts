import { fetchWithRetry } from "./api-client";
import { logger } from "./logger";

export const downloadExcelFile = async (url: string) => {
  try {
    const response = await fetchWithRetry(
      url,
      {
        method: "GET",
      },
      3, // maxRetries
      1000 // initialDelayMs
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    logger.error(`Failed to download file from ${url}`, error, "EXCEL");
    return null;
  }
};
