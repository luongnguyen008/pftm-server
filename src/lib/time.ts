import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// convert time to timestamp in seconds
export type DateType = Date | string | number;

export const toTimestamp = (time: DateType, format?: string) => {
  if (!time) return 0;

  let date;

  // If specific format provided, use it
  if (typeof time === "string" && format) {
    date = dayjs(time, format);
  } else {
    // dayjs handles string (ISO 8601, YYYY-MM-DD), Date object, and timestamp (ms)
    date = dayjs(time);
  }

  if (!date.isValid()) {
    console.warn(`Invalid date format: ${time}`);
    return 0;
  }

  return date.unix(); // unix() returns timestamp in seconds
};

/**
 * Get Year-Quarter string from Unix timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns String in format "YYYY-Q#" (e.g., "2024-Q1")
 */
export const getYearQuarter = (timestamp: number): string => {
  const date = dayjs.unix(timestamp);
  const month = date.month(); // 0-11
  const quarter = Math.floor(month / 3) + 1;
  return `${date.year()}-Q${quarter}`;
};

/**
 * Get year from Unix timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns Year as number
 */
export const getYear = (timestamp: number): number => {
  const date = dayjs.unix(timestamp);
  return date.year();
};
