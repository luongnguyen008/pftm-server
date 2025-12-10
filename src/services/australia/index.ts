import {
  COUNTRY_CODE,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
} from "../../types";
import { upsertIndicators } from "../common/repository";

const fetchAndSave = async (
  indicatorType: INDICATOR_TYPE,
  fetchLogic: () => Promise<IndicatorValue[]>,
) => {
  console.log(`[AUS] Fetching ${indicatorType}...`);
  try {
    const data = await fetchLogic();
    await upsertIndicators(data);
    console.log(`[AUS] Saved ${data.length} records for ${indicatorType}`);
  } catch (error) {
    console.error(`[AUS] Error fetching/saving ${indicatorType}:`, error);
  }
};

export const updateRBAInterestRate = async () => {
  await fetchAndSave(INDICATOR_TYPE.IR, async () => {
    // TODO: Fetch from RBA website
    return [];
  });
};

export const updateGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.GDP_GROWTH, async () => {
    return [];
  });
};

export const updateCPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CPI, async () => {
    return [];
  });
};

export const updateEmployment = async () => {
  await fetchAndSave(INDICATOR_TYPE.EMPLOYMENT_CHANGE, async () => {
    return [];
  });
};

export const updateAllAustraliaIndicators = async () => {
  await updateRBAInterestRate();
  await updateGDP();
  await updateCPI();
  await updateEmployment();
};
