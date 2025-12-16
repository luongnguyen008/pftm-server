import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";

export const updateCPI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "CPIAUCSL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateCoreCPI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_CPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "CPILFESL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_CPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updatePPI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WPSFD49207",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.PPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateCorePPI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_PPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WPSFD4131",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_PPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};
