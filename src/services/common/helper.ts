import { COUNTRY_CODE, INDICATOR_TYPE, IndicatorValue } from "../../types";
import { upsertIndicators } from "./repository";
import { logger } from "../../lib/logger";

// Helper function template to standardize fetching and saving
export const fetchAndSave = async ({
  indicatorType,
  fetchLogic,
  country,
}: {
  indicatorType: INDICATOR_TYPE;
  fetchLogic: () => Promise<IndicatorValue[]>;
  country: COUNTRY_CODE;
}) => {
  logger.service(country, `Fetching ${indicatorType}...`);
  try {
    const data = await fetchLogic();
    await upsertIndicators(data);
    logger.success(`Saved ${data.length} records for ${indicatorType}`, country);
  } catch (error) {
    logger.error(`Error fetching/saving ${indicatorType}`, error, country);
  }
};
