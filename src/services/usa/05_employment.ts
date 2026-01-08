import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";

export const updateEmploymentChangeUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // Non-Farm Payrolls
      return getDataFRED({
        seriesId: "PAYEMS",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.THOUSANDS,
      });
    },
  });
};

export const updateUnemploymentRateUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "UNRATE",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
