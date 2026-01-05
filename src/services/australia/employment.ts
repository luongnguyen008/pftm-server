import { fetchAndSave } from "../common/helper";
import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT } from "../../types";
import { getDataABS } from "../common/abs";

export const updateEmploymentChange = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName: "labour/employment-and-unemployment/labour-force-australia",
        fileName: "6202001.xlsx",
        seriesId: "A84423043C",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.THOUSANDS,
      });
    },
  });
};

export const updateUnemploymentRate = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName: "labour/employment-and-unemployment/labour-force-australia",
        fileName: "6202001.xlsx",
        seriesId: "A84423050A",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
