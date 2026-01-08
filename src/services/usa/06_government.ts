import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
} from "../../types";
import { getIndicatorsByType } from "../common/repository";
import { getDataFRED } from "../common/fred";
import { convertToBillions } from "../../lib/utils";
import { numberFormatter } from "../../lib/number-formatter";
import { getYearQuarter, getYear } from "../../lib/time";
import { fetchAndSave } from "../common/helper";
import { logger } from "../../lib/logger";

export const updateGDPNominalUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "GDP",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.BILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateGDPGrowthUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GDP_GROWTH,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "A191RL1Q225SBEA",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_GROWTH,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.PERCENT,
      });
    },
  });
};

export const updateGovernmentDebtUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GOVT_DEBT,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "GFDEBTN",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_DEBT,
        frequency: FREQUENCY.QUARTERLY,
        unit: UNIT.MILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateGovernmentReceiptsUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "FYFR",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
        frequency: FREQUENCY.YEARLY,
        unit: UNIT.MILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateGovernmentPaymentsUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "FYONET",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
        frequency: FREQUENCY.YEARLY,
        unit: UNIT.MILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateGovernmentInterestBillsUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "FYOINT",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
        frequency: FREQUENCY.YEARLY,
        unit: UNIT.MILLIONS,
        currency: Currency.USD,
      });
    },
  });
};

export const updateDebtToGDPUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.DEBT_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch Government Debt
      const debtData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_DEBT,
      });
      if (!debtData.length) {
        logger.warn("No Government Debt data found.", "USA");
        return [];
      }

      // 2. Fetch GDP Nominal
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        logger.warn("No GDP Nominal data found.", "USA");
        return [];
      }

      // 3. Map GDP by Year-Quarter for easy lookup
      const gdpMap = new Map<string, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const key = getYearQuarter(item.timestamp);
        gdpMap.set(key, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Ratio
      for (const debt of debtData) {
        const key = getYearQuarter(debt.timestamp);
        const gdpItem = gdpMap.get(key);

        if (gdpItem && gdpItem.actual !== 0) {
          const debtBillions = convertToBillions(debt.actual, debt.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          const ratio = (debtBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.DEBT_TO_GDP,
            frequency: FREQUENCY.QUARTERLY,
            timestamp: debt.timestamp,
            actual: parseFloat(ratio.toFixed(2)),
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateBudgetSurplusDeficitUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      if (!receiptsData.length) {
        logger.warn("No Government Receipts data found.", "USA");
        return [];
      }

      const paymentsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
      });
      if (!paymentsData.length) {
        logger.warn("No Government Payments data found.", "USA");
        return [];
      }

      const paymentsMap = new Map<number, { actual: number; unit?: UNIT }>();
      paymentsData.forEach((item) => {
        const year = getYear(item.timestamp);
        paymentsMap.set(year, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      for (const receipt of receiptsData) {
        const year = getYear(receipt.timestamp);
        const paymentItem = paymentsMap.get(year);

        if (paymentItem && receipt.unit && paymentItem.unit) {
          const receiptsValue =
            receipt.unit === UNIT.BILLIONS ? receipt.actual * 1000 : receipt.actual;
          const paymentsValue =
            paymentItem.unit === UNIT.BILLIONS ? paymentItem.actual * 1000 : paymentItem.actual;

          const surplusDeficit = receiptsValue - paymentsValue;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.SURPLUS_DEFICIT,
            frequency: FREQUENCY.YEARLY,
            timestamp: receipt.timestamp,
            actual: parseFloat(surplusDeficit.toFixed(2)),
            actual_formatted: numberFormatter(surplusDeficit, { unit: "M" }),
            unit: UNIT.MILLIONS,
            currency: Currency.USD,
          });
        }
      }
      return result;
    },
  });
};

export const updateSurplusDeficitToGDPUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      const surplusDeficitData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
      });
      if (!surplusDeficitData.length) {
        logger.warn("No Surplus/Deficit data found.", "USA");
        return [];
      }

      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        logger.warn("No GDP Nominal data found.", "USA");
        return [];
      }

      const gdpQ4Map = new Map<number, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const yearQuarter = getYearQuarter(item.timestamp);
        if (yearQuarter.endsWith("-Q4")) {
          const year = getYear(item.timestamp);
          gdpQ4Map.set(year, { actual: item.actual, unit: item.unit });
        }
      });

      const result: IndicatorValue[] = [];

      for (const surplusDeficit of surplusDeficitData) {
        const year = getYear(surplusDeficit.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        if (gdpItem && gdpItem.actual !== 0) {
          const surplusDeficitBillions = convertToBillions(
            surplusDeficit.actual,
            surplusDeficit.unit
          );
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          const ratio = (surplusDeficitBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: surplusDeficit.timestamp,
            actual: parseFloat(ratio.toFixed(2)),
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateInterestBillsToGDPUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      const interestBillsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });
      if (!interestBillsData.length) {
        logger.warn("No Government Interest Bills data found.", "USA");
        return [];
      }

      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        logger.warn("No GDP Nominal data found.", "USA");
        return [];
      }

      const gdpQ4Map = new Map<number, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const yearQuarter = getYearQuarter(item.timestamp);
        if (yearQuarter.endsWith("-Q4")) {
          const year = getYear(item.timestamp);
          gdpQ4Map.set(year, { actual: item.actual, unit: item.unit });
        }
      });

      const result: IndicatorValue[] = [];

      for (const interestBills of interestBillsData) {
        const year = getYear(interestBills.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        if (gdpItem && gdpItem.actual !== 0) {
          const interestBillsBillions = convertToBillions(interestBills.actual, interestBills.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          const ratio = (interestBillsBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: interestBills.timestamp,
            actual: parseFloat(ratio.toFixed(2)),
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateLiquidityCoverUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.LIQUIDITY_COVER,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      if (!receiptsData.length) {
        logger.warn("No Government Receipts data found.", "USA");
        return [];
      }

      const interestBillsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });
      if (!interestBillsData.length) {
        logger.warn("No Government Interest Bills data found.", "USA");
        return [];
      }

      const interestBillsMap = new Map<number, { actual: number; unit?: UNIT }>();
      interestBillsData.forEach((item) => {
        const year = getYear(item.timestamp);
        interestBillsMap.set(year, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      for (const receipt of receiptsData) {
        const year = getYear(receipt.timestamp);
        const interestBillsItem = interestBillsMap.get(year);

        if (interestBillsItem && interestBillsItem.actual !== 0) {
          const receiptsBillions = convertToBillions(receipt.actual, receipt.unit);
          const interestBillsBillions = convertToBillions(
            interestBillsItem.actual,
            interestBillsItem.unit
          );

          const ratio = receiptsBillions / interestBillsBillions;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.LIQUIDITY_COVER,
            frequency: FREQUENCY.YEARLY,
            timestamp: receipt.timestamp,
            actual: parseFloat(ratio.toFixed(2)),
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}x`,
            unit: UNIT.INDEX,
          });
        }
      }

      return result;
    },
  });
};
