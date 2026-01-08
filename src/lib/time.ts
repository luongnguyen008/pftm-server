import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// convert time to timestamp in seconds
export type DateType = Date | string | number | dayjs.Dayjs;

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

  return date.utc().unix(); // unix() returns timestamp in seconds
};

/**
 * Get Year-Quarter string from Unix timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns String in format "YYYY-Q#" (e.g., "2024-Q1")
 */
export const getYearQuarter = (timestamp: number): string => {
  const date = dayjs.unix(timestamp).utc();
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
  const date = dayjs.unix(timestamp).utc();
  return date.year();
};

/**
 * Convert Excel serial date to Unix timestamp (seconds)
 * Excel dates start from 1899-12-30
 * @param excelDate Excel serial date number
 * @returns Unix timestamp in seconds
 */
export const excelTimestampToUnix = (excelDate: number): number => {
  // Excel's base date is December 30, 1899
  // 25569 is the number of days between 1899-12-30 and 1970-01-01
  const daysSinceEpoch = excelDate - 25569;
  const secondsInDay = 86400;
  return Math.floor(daysSinceEpoch * secondsInDay);
};

/**
 * Get current date in format YYYY-MM-DD-HH-MM-SS
 * @returns String in format "YYYY-MM-DD-HH-MM-SS" (e.g., "2024-01-01-00-00-00")
 */
export function getDateNowString() {
  return dayjs().format("YYYY-MM-DD-HH-MM-SS");
}

/**
 * Format date for ABS statistics URL (e.g., "sep-2024")
 * @param date Date object, dayjs object, or timestamp
 * @param frequency Frequency of the data (optional)
 * @returns Formatted date string in "mmm-yyyy" format
 */
export const formatMonthyear = (date: DateType): string => {
  const d = dayjs(date);
  if (!d.isValid()) return "";

  return d.format("MMM-YYYY").toLowerCase();
};

/**
 * Convert fiscal year string (e.g., "2024-25") to Unix timestamp (seconds)
 * Represents December 31st of the second year (e.g., "2024-25" -> 2025-12-31)
 * @param fiscalYear String in format "YYYY-YY" or "YYYY"
 * @returns Unix timestamp in seconds
 */
export const fiscalYearToTimestamp = (fiscalYear: string): number => {
  if (!fiscalYear) return 0;

  // Extract the starting year (first 4 digits)
  const match = fiscalYear.match(/^(\d{4})/);
  if (!match) {
    console.warn(`Invalid fiscal year format: ${fiscalYear}`);
    return 0;
  }

  const startYear = parseInt(match[1], 10);
  const targetYear = startYear + 1;

  // Create date for December 31st of the second year in UTC
  return dayjs.utc(`${targetYear}-12-31T23:59:59Z`).unix();
};
