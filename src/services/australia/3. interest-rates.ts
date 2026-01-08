import { fetchAndSave } from "../common/helper";
import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT } from "../../types";
import { fetchRBAData } from "../common/rba";

export const updateInterestRate = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.IR,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchRBAData({
        fileName: "f01hist.xlsx",
        seriesId: "FIRMMCRT",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.IR,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
