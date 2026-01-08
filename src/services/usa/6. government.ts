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

export const updateGDPNominal = async () => {
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

export const updateGDPGrowth = async () => {
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

export const updateGovernmentDebt = async () => {
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

export const updateGovernmentReceipts = async () => {
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

export const updateGovernmentPayments = async () => {
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

export const updateGovernmentInterestBills = async () => {
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

export const updateDebtToGDP = async () => {
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
        console.warn("No Government Debt data found.");
        return [];
      }

      // 2. Fetch GDP Nominal
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        console.warn("No GDP Nominal data found.");
        return [];
      }

      // 3. Map GDP by Year-Quarter for easy lookup
      // Key: "YYYY-Q#", Value: { actual: number, unit?: UNIT }
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

        // Must have corresponding GDP data for the same period
        if (gdpItem && gdpItem.actual !== 0) {
          // Normalize both to Billions
          const debtBillions = convertToBillions(debt.actual, debt.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          const ratio = (debtBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.DEBT_TO_GDP,
            frequency: FREQUENCY.QUARTERLY,
            timestamp: debt.timestamp,
            actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateBudgetSurplusDeficit = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch Government Receipts
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      if (!receiptsData.length) {
        console.warn("No Government Receipts data found.");
        return [];
      }

      // 2. Fetch Government Payments
      const paymentsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
      });
      if (!paymentsData.length) {
        console.warn("No Government Payments data found.");
        return [];
      }

      // 3. Map Payments by year for easy lookup (both are YEARLY frequency)
      const paymentsMap = new Map<number, { actual: number; unit?: UNIT }>();
      paymentsData.forEach((item) => {
        const year = getYear(item.timestamp);
        paymentsMap.set(year, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Surplus/Deficit (Receipts - Payments)
      for (const receipt of receiptsData) {
        const year = getYear(receipt.timestamp);
        const paymentItem = paymentsMap.get(year);

        // Must have corresponding payment data for the same year
        if (paymentItem && receipt.unit && paymentItem.unit) {
          // Both should be in MILLIONS based on our data setup
          // Normalize both to same unit (Millions)
          const receiptsValue =
            receipt.unit === UNIT.BILLIONS ? receipt.actual * 1000 : receipt.actual;
          const paymentsValue =
            paymentItem.unit === UNIT.BILLIONS ? paymentItem.actual * 1000 : paymentItem.actual;

          // Surplus/Deficit = Receipts - Payments
          // Positive = Surplus, Negative = Deficit
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

export const updateSurplusDeficitToGDP = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch Surplus/Deficit data (YEARLY)
      const surplusDeficitData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
      });
      if (!surplusDeficitData.length) {
        console.warn("No Surplus/Deficit data found.");
        return [];
      }

      // 2. Fetch GDP Nominal data (QUARTERLY)
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        console.warn("No GDP Nominal data found.");
        return [];
      }

      // 3. Map GDP by year (using Q4 data only)
      // Key: year number, Value: { actual: number, unit?: UNIT }
      const gdpQ4Map = new Map<number, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const yearQuarter = getYearQuarter(item.timestamp);
        // Only keep Q4 data (latest quarter of the year)
        if (yearQuarter.endsWith("-Q4")) {
          const year = getYear(item.timestamp);
          gdpQ4Map.set(year, { actual: item.actual, unit: item.unit });
        }
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Ratio (Surplus/Deficit to GDP)
      for (const surplusDeficit of surplusDeficitData) {
        const year = getYear(surplusDeficit.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        // Must have corresponding Q4 GDP data for the same year
        if (gdpItem && gdpItem.actual !== 0) {
          // Normalize both to Billions
          const surplusDeficitBillions = convertToBillions(
            surplusDeficit.actual,
            surplusDeficit.unit
          );
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          // Calculate ratio as percentage
          const ratio = (surplusDeficitBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: surplusDeficit.timestamp,
            actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateInterestBillsToGDP = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch Government Interest Bills (YEARLY)
      const interestBillsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });
      if (!interestBillsData.length) {
        console.warn("No Government Interest Bills data found.");
        return [];
      }

      // 2. Fetch GDP Nominal data (QUARTERLY)
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });
      if (!gdpData.length) {
        console.warn("No GDP Nominal data found.");
        return [];
      }

      // 3. Map GDP by year (using Q4 data only)
      // Key: year number, Value: { actual: number, unit?: UNIT }
      const gdpQ4Map = new Map<number, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const yearQuarter = getYearQuarter(item.timestamp);
        // Only keep Q4 data (latest quarter of the year)
        if (yearQuarter.endsWith("-Q4")) {
          const year = getYear(item.timestamp);
          gdpQ4Map.set(year, { actual: item.actual, unit: item.unit });
        }
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Ratio (Interest Bills to GDP)
      for (const interestBills of interestBillsData) {
        const year = getYear(interestBills.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        // Must have corresponding Q4 GDP data for the same year
        if (gdpItem && gdpItem.actual !== 0) {
          // Normalize both to Billions
          const interestBillsBillions = convertToBillions(interestBills.actual, interestBills.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

          // Calculate ratio as percentage
          const ratio = (interestBillsBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: interestBills.timestamp,
            actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
            unit: UNIT.PERCENT,
          });
        }
      }

      return result;
    },
  });
};

export const updateLiquidityCover = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.LIQUIDITY_COVER,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch Government Receipts (YEARLY)
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      if (!receiptsData.length) {
        console.warn("No Government Receipts data found.");
        return [];
      }

      // 2. Fetch Government Interest Bills (YEARLY)
      const interestBillsData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });
      if (!interestBillsData.length) {
        console.warn("No Government Interest Bills data found.");
        return [];
      }

      // 3. Map Interest Bills by year for easy lookup
      const interestBillsMap = new Map<number, { actual: number; unit?: UNIT }>();
      interestBillsData.forEach((item) => {
        const year = getYear(item.timestamp);
        interestBillsMap.set(year, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];

      // 4. Calculate Liquidity Cover (Receipts / Interest Bills)
      for (const receipt of receiptsData) {
        const year = getYear(receipt.timestamp);
        const interestBillsItem = interestBillsMap.get(year);

        // Must have corresponding interest bills data for the same year
        if (interestBillsItem && interestBillsItem.actual !== 0) {
          // Normalize both to same unit (Billions)
          const receiptsBillions = convertToBillions(receipt.actual, receipt.unit);
          const interestBillsBillions = convertToBillions(
            interestBillsItem.actual,
            interestBillsItem.unit
          );

          // Calculate ratio (how many times receipts cover interest bills)
          const ratio = receiptsBillions / interestBillsBillions;

          result.push({
            country: COUNTRY_CODE.USA,
            indicator_type: INDICATOR_TYPE.LIQUIDITY_COVER,
            frequency: FREQUENCY.YEARLY,
            timestamp: receipt.timestamp,
            actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
            actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}x`,
            unit: UNIT.INDEX,
          });
        }
      }

      return result;
    },
  });
};

