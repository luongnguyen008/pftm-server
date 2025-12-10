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
  if (typeof time === 'string' && format) {
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
