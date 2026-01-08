import { fetchAndSave } from "../common/helper";
import {
  INDICATOR_TYPE,
  COUNTRY_CODE,
  FREQUENCY,
  UNIT,
  Currency,
  IndicatorValue,
} from "../../types";
import { getDataABS } from "../common/abs";
import { getIndicatorsByType } from "../common/repository";
import { convertToBillions } from "../../lib/utils";
import { numberFormatter } from "../../lib/number-formatter";
import { getYear, getYearQuarter } from "../../lib/time";
import * as xlsx from "xlsx";
import { downloadExcelFile } from "../../lib/excel";
import {
  getLatestPboHistoricalFiscalDataLink,
  extractIndicatorDataFromPboAus,
} from "../common/pbo";
import { upsertIndicators } from "../common/repository";

// ==========================================
// 1. Production & National Accounts (ABS)
// ==========================================

/**
 * Updates Nominal GDP for Australia.
 * Source: ABS - Key Aggregates (5206.0)
 */
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

/**
 * Updates Real GDP Growth for Australia.
 * Source: ABS - Key Aggregates (5206.0)
 */
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

// ==========================================
// 2. Fiscal Indicators (PBO)
// ==========================================

type PboMapping = {
  sheet: string;
  label: string;
  type: INDICATOR_TYPE;
};

/**
 * Updates Australian fiscal indicators using data from the Parliamentary Budget Office (PBO).
 * Fetches Receipts, Payments, Net Interest, and Government Debt (AGS).
 * Source: Historical Fiscal Data (Table 1, 2, and 9)
 */
export const updatePboAustraliaIndicators = async () => {
  console.log("[AUSTRALIA] Starting PBO Fiscal Data update...");

  try {
    const link = await getLatestPboHistoricalFiscalDataLink();
    if (!link) {
      console.warn("[AUSTRALIA] Could not retrieve PBO data link. Skipping update.");
      return;
    }

    const buffer = await downloadExcelFile(link);
    if (!buffer) {
      console.error("[AUSTRALIA] Failed to download PBO Excel file.");
      return;
    }

    const workbook = xlsx.read(buffer, { type: "buffer" });

    const mappings: PboMapping[] = [
      {
        sheet: "Table 1",
        label: "Receipts",
        type: INDICATOR_TYPE.GOVT_RECEIPTS,
      },
      {
        sheet: "Table 1",
        label: "Payments",
        type: INDICATOR_TYPE.GOVT_PAYMENTS,
      },
      {
        sheet: "Table 2",
        label: "Net interest payments",
        type: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      },
      {
        sheet: "Table 9",
        label: "Face value of Australian Government Securities (AGS) on issue",
        type: INDICATOR_TYPE.GOVT_DEBT,
      },
    ];

    for (const mapping of mappings) {
      console.log(`[AUSTRALIA] Extracting ${mapping.type} ("${mapping.label}") from ${mapping.sheet}...`);
      const data = extractIndicatorDataFromPboAus(workbook, mapping.sheet, mapping.label);

      if (data && data.length > 0) {
        const indicators: IndicatorValue[] = data.map((item) => ({
          country: COUNTRY_CODE.AUSTRALIA,
          indicator_type: mapping.type,
          frequency: FREQUENCY.YEARLY,
          timestamp: item.timestamp,
          actual: item.value,
          unit: UNIT.MILLIONS,
          currency: Currency.AUD,
        }));

        await upsertIndicators(indicators);
        console.log(
          `[AUSTRALIA] Saved ${indicators.length} records for ${mapping.type}`
        );
      } else {
        console.warn(`[AUSTRALIA] No data found for ${mapping.type} in ${mapping.sheet}`);
      }
    }

    console.log("[AUSTRALIA] Completed PBO Fiscal Data update.");
  } catch (error) {
    console.error("[AUSTRALIA] Error during PBO Fiscal Data update:", error);
  }
};

// ==========================================
// 3. Derived Derived & Ratios
// ==========================================

/**
 * Calculates Debt to GDP ratio.
 * Combines Yearly PBO Debt with Q4 Nominal GDP.
 */
export const updateDebtToGDP = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.DEBT_TO_GDP,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      const debtData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_DEBT,
      });

      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });

      if (!debtData.length || !gdpData.length) {
        return [];
      }

      // Map GDP by year (using Q4 data only)
      const gdpQ4Map = new Map<number, { actual: number; unit?: UNIT }>();
      gdpData.forEach((item) => {
        const yearQuarter = getYearQuarter(item.timestamp);
        if (yearQuarter.endsWith("-Q4")) {
          const year = getYear(item.timestamp);
          gdpQ4Map.set(year, { actual: item.actual, unit: item.unit });
        }
      });
      
      const result: IndicatorValue[] = [];

      for (const debt of debtData) {
        const year = getYear(debt.timestamp);
        const gdpItem = gdpQ4Map.get(year);
        if (gdpItem && gdpItem.actual !== 0) {
          const debtBillions = convertToBillions(debt.actual, debt.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);
          const ratio = (debtBillions / gdpBillions) * 100;
          result.push({
            country: COUNTRY_CODE.AUSTRALIA,
            indicator_type: INDICATOR_TYPE.DEBT_TO_GDP,
            frequency: FREQUENCY.YEARLY,
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

/**
 * Calculates Budget Surplus/Deficit.
 * Surplus = Receipts - Payments.
 */
export const updateBudgetSurplusDeficit = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      const paymentsData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
      });

      if (!receiptsData.length || !paymentsData.length) {
        console.warn("No Government Receipts or Payments data found.");
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

        if (paymentItem) {
          // Both are in Millions per our PBO ingestion
          const surplusDeficit = receipt.actual - paymentItem.actual;

          result.push({
            country: COUNTRY_CODE.AUSTRALIA,
            indicator_type: INDICATOR_TYPE.SURPLUS_DEFICIT,
            frequency: FREQUENCY.YEARLY,
            timestamp: receipt.timestamp,
            actual: parseFloat(surplusDeficit.toFixed(2)),
            actual_formatted: numberFormatter(surplusDeficit, { unit: "M", currency: "AUD" }),
            unit: UNIT.MILLIONS,
            currency: Currency.AUD,
          });
        }
      }
      return result;
    },
  });
};

/**
 * Calculates Budget Surplus/Deficit to GDP ratio.
 */
export const updateSurplusDeficitToGDP = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      const surplusDeficitData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.SURPLUS_DEFICIT,
      });
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });

      if (!surplusDeficitData.length || !gdpData.length) {
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
      for (const item of surplusDeficitData) {
        const year = getYear(item.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        if (gdpItem && gdpItem.actual !== 0) {
          const surplusDeficitBillions = convertToBillions(item.actual, item.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);
          const ratio = (surplusDeficitBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.AUSTRALIA,
            indicator_type: INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: item.timestamp,
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

/**
 * Calculates Government Interest Charges to GDP ratio.
 */
export const updateInterestBillsToGDP = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      const billsData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });
      const gdpData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      });

      if (!billsData.length || !gdpData.length) {
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
      for (const item of billsData) {
        const year = getYear(item.timestamp);
        const gdpItem = gdpQ4Map.get(year);

        if (gdpItem && gdpItem.actual !== 0) {
          const billsBillions = convertToBillions(item.actual, item.unit);
          const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);
          const ratio = (billsBillions / gdpBillions) * 100;

          result.push({
            country: COUNTRY_CODE.AUSTRALIA,
            indicator_type: INDICATOR_TYPE.INTEREST_BILLS_TO_GDP,
            frequency: FREQUENCY.YEARLY,
            timestamp: item.timestamp,
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

/**
 * Calculates Liquidity Cover (Receipts / Interest Bills).
 * Measures how many times government revenue covers interest expenses.
 */
export const updateLiquidityCover = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.LIQUIDITY_COVER,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      const receiptsData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      });
      const billsData = await getIndicatorsByType({
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      });

      if (!receiptsData.length || !billsData.length) {
        return [];
      }

      const billsMap = new Map<number, { actual: number; unit?: UNIT }>();
      billsData.forEach((item) => {
        const year = getYear(item.timestamp);
        billsMap.set(year, { actual: item.actual, unit: item.unit });
      });

      const result: IndicatorValue[] = [];
      for (const receipt of receiptsData) {
        const year = getYear(receipt.timestamp);
        const billItem = billsMap.get(year);

        if (billItem && billItem.actual !== 0) {
          const receiptsBillions = convertToBillions(receipt.actual, receipt.unit);
          const billsBillions = convertToBillions(billItem.actual, billItem.unit);
          const ratio = receiptsBillions / billsBillions;

          result.push({
            country: COUNTRY_CODE.AUSTRALIA,
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

