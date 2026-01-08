import { fetchAndSave } from "../common/helper";
import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT } from "../../types";
import { fetchRBAData } from "../common/rba";
import { getDataABS } from "../common/abs";

export const updateCPIAustralia = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CPI_CHANGE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchRBAData({
        fileName: "g01hist.xlsx",
        seriesId: "GCPIAGSAQP",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.CPI_CHANGE,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};

export const updateCoreCPIAustralia = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_CPI_CHANGE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchRBAData({
        fileName: "g01hist.xlsx",
        seriesId: "GCPIAGSAQP",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.CORE_CPI_CHANGE,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};

export const updatePPIAustralia = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PPI_CHANGE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName: "economy/price-indexes-and-inflation/producer-price-indexes-australia",
        fileName: "642701.xlsx",
        seriesId: "A2314866J",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.PPI_CHANGE,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};

export const updateCorePPIAustralia = async () => {
  // Not available
  return [];
};
