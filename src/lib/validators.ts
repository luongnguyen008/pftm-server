import dayjs from "dayjs";
import { IndicatorValue, UNIT } from "../types";

/**
 * Data validation utilities to ensure data quality before database insertion
 */

/**
 * Check if timestamp is valid
 * - Must be greater than 0
 * - Must not be in the future
 *
 * @param timestamp Unix timestamp in seconds
 * @returns true if valid
 */
export const isValidTimestamp = (timestamp: number): boolean => {
  if (timestamp <= 0) return false;

  const now = dayjs().unix();
  // Allow up to 1 day in future to handle timezone issues
  const maxFutureTimestamp = now + 86400;

  return timestamp <= maxFutureTimestamp;
};

/**
 * Check if actual value is valid numeric
 *
 * @param actual The numeric value
 * @returns true if valid
 */
export const isValidActualValue = (actual: number): boolean => {
  if (!Number.isFinite(actual)) return false;
  if (Number.isNaN(actual)) return false;
  return true;
};

/**
 * Validate indicator value with unit-specific constraints
 *
 * @param data Indicator value to validate
 * @returns true if valid, false otherwise
 */
export const validateIndicatorValue = (data: IndicatorValue): boolean => {
  // Required fields
  if (!data.country || !data.indicator_type) {
    return false;
  }

  if (!data.timestamp || !isValidTimestamp(data.timestamp)) {
    return false;
  }

  if (data.actual === undefined || data.actual === null) {
    return false;
  }

  if (!isValidActualValue(data.actual)) {
    return false;
  }

  // Unit-specific validation
  if (data.unit === UNIT.PERCENT) {
    // Percentages should typically be between -1000% and 1000%
    // (Allow for some extreme cases like hyperinflation)
    if (Math.abs(data.actual) > 1000) {
      return false;
    }
  }

  // Forecast validation (if present)
  if (data.forecast !== undefined && data.forecast !== null) {
    if (!isValidActualValue(data.forecast)) {
      return false;
    }
  }

  return true;
};

/**
 * Validate array of indicator values and return valid ones
 *
 * @param data Array of indicator values
 * @returns Object with valid data and count of invalid records
 */
export const validateAndFilter = (
  data: IndicatorValue[]
): {
  validData: IndicatorValue[];
  invalidCount: number;
} => {
  const validData = data.filter(validateIndicatorValue);
  const invalidCount = data.length - validData.length;

  return { validData, invalidCount };
};
