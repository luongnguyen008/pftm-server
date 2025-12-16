import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";

// ==========================================
// 3. Interest Rate
// ==========================================

export const updateInterestRate = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.IR,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "FEDFUNDS",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.IR,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
