import { COUNTRY_CODE, INDICATOR_TYPE, IndicatorValue } from "../../types";
import { upsertIndicators } from "./repository";

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
  console.log(`[${country}] Fetching ${indicatorType}...`);
  try {
    const data = await fetchLogic();
    await upsertIndicators(data);
    console.log(`[${country}] Saved ${data.length} records for ${indicatorType}`);
  } catch (error) {
    console.error(`[${country}] Error fetching/saving ${indicatorType}:`, error);
  }
};
