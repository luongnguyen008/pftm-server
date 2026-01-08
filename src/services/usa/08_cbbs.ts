import { numberFormatter } from "../../lib/number-formatter";
import { getYearQuarter } from "../../lib/time";
import { convertToBillions } from "../../lib/utils";
import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
} from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";
import { getIndicatorsByType } from "../common/repository";

export const updateCentralBankBalanceSheetUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WALCL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS,
        frequency: FREQUENCY.WEEKLY,
        unit: UNIT.MILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateCBBSTotalAssetsToGDPUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch CBBS Total Assets (WEEKLY)
      const cbbsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS,
      });
      if (!cbbsData.length) {
        console.warn("No CBBS Total Assets data found.");
        return [];
      }

      // 2. Fetch GDP Nominal data (QUARTERLY)
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        console.warn("No GDP Nominal data found.");
        return [];
      }

      // 3. Map GDP by Year-Quarter for easy lookup
      const gdpMap = new Map<string, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const key = getYearQuarter(item.timestamp);
        gdpMap.set(key, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Ratio (CBBS Total Assets to GDP)
      for (const cbbs of cbbsData) {
        const key = getYearQuarter(cbbs.timestamp);
        const gdpItem = gdpMap.get(key);

        // Must have corresponding GDP data for the same quarter
        if (gdpItem && gdpItem.actual !== 0) {
          // Normalize both to Billions
          const cbbsBillions = convertToBillions(cbbs.actual, cbbs.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          // Calculate ratio as percentage
          const ratio = (cbbsBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.CBBS_TOTAL_ASSETS_TO_GDP,
            frequency: FREQUENCY.WEEKLY,
            timestamp: cbbs.timestamp,
            actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};
