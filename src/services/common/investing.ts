import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  IAttrInvesting,
  INDICATOR_TYPE,
  IndicatorValue,
  InvestingDataType,
  UNIT,
} from "../../types";
import { toTimestamp } from "../../lib/time";

export const fetchInvestingData = async ({
  url,
  country,
  indicatorType,
  frequency,
  unit,
  currency,
}: {
  url: string;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  frequency: FREQUENCY;
  unit?: UNIT;
  currency?: Currency;
}): Promise<IndicatorValue[]> => {
  try {
    const response = await fetch(url);
    const json = (await response.json()) as InvestingDataType;

    // Validate response structure
    if (!json || !json.attr || !Array.isArray(json.attr)) {
      console.warn(`[${country}] Invalid data format for ${indicatorType} from ${url}`);
      return [];
    }

    return json.attr.map((item: IAttrInvesting) => {
      return {
        country: country,
        indicator_type: indicatorType,
        frequency: frequency,
        timestamp: toTimestamp(item.timestamp),
        actual: item.actual,
        actual_formatted: item.actual_formatted,
        forecast: item.forecast,
        forecast_formatted: item.forecast_formatted,
        unit: unit,
        currency: currency,
      };
    });
  } catch (error) {
    console.error(`[${country}] Error fetching ${indicatorType} from investing:`, error);
    return [];
  }
};
