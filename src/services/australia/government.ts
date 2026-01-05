import { fetchAndSave } from "../common/helper";
import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT, Currency } from "../../types";
import { getDataABS } from "../common/abs";

export const updateGDPNominal = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName:
          "economy/national-accounts/australian-national-accounts-national-income-expenditure-and-product",
        fileName: "5206001_Key_Aggregates.xlsx",
        seriesId: "A2304418T",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.MILLIONS,
        currency: Currency.AUD,
      });
    },
  });
};

export const updateGDPGrowth = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GDP_GROWTH,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName:
          "economy/national-accounts/australian-national-accounts-national-income-expenditure-and-product",
        fileName: "5206001_Key_Aggregates.xlsx",
        seriesId: "A2304370T",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GDP_GROWTH,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};

export const updateGovernmentDebt = async () => {
  // TODO: Implement
};

export const updateGovernmentReceipts = async () => {
  // TODO: Implement
};

export const updateGovernmentPayments = async () => {
  // TODO: Implement
};

export const updateGovernmentInterestBills = async () => {
  // TODO: Implement
};

export const updateDebtToGDP = async () => {
  // TODO: Implement
};

export const updateBudgetSurplusDeficit = async () => {
  // TODO: Implement
};

export const updateSurplusDeficitToGDP = async () => {
  // TODO: Implement
};

export const updateInterestBillsToGDP = async () => {
  // TODO: Implement
};

export const updateLiquidityCover = async () => {
  // TODO: Implement
};

export const updateTreasuryYield10Y = async () => {
  // TODO: Implement
};
