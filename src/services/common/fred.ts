import { toTimestamp } from "../../lib/time";
import { fetchWithRetry } from "../../lib/api-client";
import {
  COUNTRY_CODE,
  FredDataObservation,
  FredDataType,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
  Currency,
} from "../../types";
import { logger } from "../../lib/logger";

export const getDataFRED = async ({
  seriesId,
  country,
  indicatorType,
  frequency,
  unit,
  currency,
}: {
  seriesId: string;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  frequency: FREQUENCY;
  unit?: UNIT;
  currency?: Currency;
}): Promise<IndicatorValue[]> => {
  try {
    const API_KEY = "811703ee9116f794637814b4d64df78d";

    const response = await fetchWithRetry(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      3, // maxRetries
      1000 // initialDelayMs
    );
    const data = (await response.json()) as FredDataType;
    return data.observations.map((item: FredDataObservation) => {
      return {
        country: country,
        indicator_type: indicatorType,
        frequency: frequency,
        timestamp: toTimestamp(item.date),
        actual: isNaN(Number(item.value)) ? 0 : Number(item.value),
        unit: unit,
        currency: currency,
      };
    });
  } catch (error: any) {
    logger.error(`Error fetching data for ${seriesId}`, error, "FRED");
    throw error;
  }
};
