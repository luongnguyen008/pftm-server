import { toTimestamp } from "../../lib/time";
import { COUNTRY_CODE, FredDataObservation, FredDataType, FREQUENCY, INDICATOR_TYPE, IndicatorValue } from "../../types";

export const getDataFRED = async ({
  seriesId,
  country,
  indicatorType,
  frequency,
}: {
  seriesId: string;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  frequency: FREQUENCY;
}): Promise<IndicatorValue[]> => {
    try {
      const API_KEY = '811703ee9116f794637814b4d64df78d';
  
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
      );
      const data = await response.json() as FredDataType;
      return data.observations.map((item: FredDataObservation) => {
        return {
          country: country,
          indicator_type: indicatorType,
          frequency: frequency,
          timestamp: toTimestamp(item.date),
          actual: isNaN(Number(item.value)) ? 0 : Number(item.value),
        };
      });

    } catch (error: any) {
      console.error('Error making GET request:', error.message);
      throw error;
    }
  };