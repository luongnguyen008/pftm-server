import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";

/**
 * Updates 10-Year Treasury Yield for the USA.
 * Source: FRED (WGS10YR)
 */
export const updateTreasuryYield10YUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.TREASURY_10_YEAR,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WGS10YR",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.TREASURY_10_YEAR,
        frequency: FREQUENCY.WEEKLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};
