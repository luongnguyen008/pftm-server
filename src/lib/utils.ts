import { numberFormatter } from "./number-formatter";
import { COUNTRY_CODE, INDICATOR_TYPE, IndicatorValue, UNIT } from "../types";

/**
 * Convert a value from various units to Billions
 * @param value The numeric value to convert
 * @param unit The unit of the input value
 * @returns Value in Billions
 */
export const convertToBillions = (value: number, unit?: UNIT): number => {
  if (!unit) return value; // Default to raw if no unit (assume Billions or acceptable scale)

  switch (unit) {
    case UNIT.MILLIONS:
      return value / 1000;
    case UNIT.THOUSANDS:
      return value / 1_000_000;
    case UNIT.BILLIONS:
      return value;
    default:
      return value;
  }
};

/**
 * Calculate percentage change from previous data point
 * @param data Array of indicator values sorted by timestamp ASC
 * @param indicatorType The indicator type for the result
 * @param country The country code for the result
 * @returns Array of change values as percentages
 */
export const calculateChange = (
  data: IndicatorValue[],
  indicatorType: INDICATOR_TYPE,
  country: COUNTRY_CODE
): IndicatorValue[] => {
  if (data.length < 2) return []; // Need at least 2 points to calculate change

  const result: IndicatorValue[] = [];

  // Calculate change for each data point (starting from index 1)
  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];

    // Calculate percentage change from previous point
    if (previous.actual !== 0) {
      const change = ((current.actual - previous.actual) / previous.actual) * 100;

      result.push({
        country,
        indicator_type: indicatorType,
        frequency: current.frequency, // Keep the same frequency as source data
        timestamp: current.timestamp,
        actual: parseFloat(change.toFixed(2)), // Keep 2 decimals
        actual_formatted: `${numberFormatter(change, { decimals: 2 })}%`,
        unit: UNIT.PERCENT,
      });
    }
  }

  return result;
};
