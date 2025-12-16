import { COUNTRY_CODE, Currency, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";

export const updateMoneySupplyM2 = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.M2,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "M2SL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.M2,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.BILLIONS,
        currency: Currency.USD,
      });
    },
  });
};
