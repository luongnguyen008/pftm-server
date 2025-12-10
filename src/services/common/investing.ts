import {
  COUNTRY_CODE,
  FREQUENCY,
  IAttrInvesting,
  INDICATOR_TYPE,
  IndicatorValue,
  InvestingDataType,
} from "../../types";
import { toTimestamp } from "../../lib/time";

export const fetchInvestingData = async (
  {url, country, indicatorType, frequency}: {
    url: string;
    country: COUNTRY_CODE;
    indicatorType: INDICATOR_TYPE;
    frequency: FREQUENCY;
  }
): Promise<IndicatorValue[]> => {
  try {
    const response = await fetch(url);
    const json = (await response.json()) as InvestingDataType;

    // Validate response structure
    if (!json || !json.attr || !Array.isArray(json.attr)) {
      console.warn(
        `[${country}] Invalid data format for ${indicatorType} from ${url}`,
      );
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
      };
    });
  } catch (error) {
    console.error(
      `[${country}] Error fetching ${indicatorType} from investing:`,
      error,
    );
    return [];
  }
};
