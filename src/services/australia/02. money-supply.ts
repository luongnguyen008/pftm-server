import { fetchAndSave } from "../common/helper";
import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT } from "../../types";
import { fetchRBAData } from "../common/rba";

export const updateMoneySupplyM3ChangeAustralia = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.M3_CHANGE,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchRBAData({
        fileName: "d01hist.xlsx",
        seriesId: "DGFAM3M",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.M3_CHANGE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
