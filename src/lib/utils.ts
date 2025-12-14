import { UNIT } from "../types";

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
