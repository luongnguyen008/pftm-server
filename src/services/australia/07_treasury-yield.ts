import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { fetchAndSave } from "../common/helper";
import { fetchRBAData } from "../common/rba";

/**
 * Updates 10-Year Treasury Yield for Australia.
 */
export const updateTreasuryYield10YAustralia = async () => {
  await fetchAndSave({
      indicatorType: INDICATOR_TYPE.TREASURY_10_YEAR,
      country: COUNTRY_CODE.AUSTRALIA,
      fetchLogic: async () => {
        return fetchRBAData({
          fileName: "f02d.xlsx",
          seriesId: "FCMYGBAG10D",
          country: COUNTRY_CODE.AUSTRALIA,
          indicatorType: INDICATOR_TYPE.TREASURY_10_YEAR,
          frequency: FREQUENCY.DAILY,
          unit: UNIT.PERCENT,
        });
      },
    });
};
