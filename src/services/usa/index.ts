import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
} from "../../types";
import { upsertIndicators, getIndicatorsByType } from "../common/repository";
import { fetchInvestingData } from "../common/investing";
import { getDataFRED } from "../common/fred";
import { convertToBillions } from "../../lib/utils";
import { numberFormatter } from "../../lib/number-formatter";
import { getYearQuarter, getYear } from "../../lib/time";

// Helper function template to standardize fetching and saving
const fetchAndSave = async (
  indicatorType: INDICATOR_TYPE,
  fetchLogic: () => Promise<IndicatorValue[]>
) => {
  console.log(`[USA] Fetching ${indicatorType}...`);
  try {
    const data = await fetchLogic();
    await upsertIndicators(data);
    console.log(`[USA] Saved ${data.length} records for ${indicatorType}`);
  } catch (error) {
    console.error(`[USA] Error fetching/saving ${indicatorType}:`, error);
  }
};

// ==========================================
// 1. Nhóm chỉ số sản xuất & tiêu dùng
// ==========================================

export const updateManufacturingPMI = async () => {
  await fetchAndSave(INDICATOR_TYPE.PMI, async () => {
    return fetchInvestingData({
      url: "https://sbcharts.investing.com/events_charts/us/173.json",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.PMI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.POINTS,
    });
  });
};

export const updateServicesPMI = async () => {
  await fetchAndSave(INDICATOR_TYPE.SERVICE_PMI, async () => {
    return fetchInvestingData({
      url: "https://sbcharts.investing.com/events_charts/us/176.json",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.SERVICE_PMI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.POINTS,
    });
  });
};

export const updateConsumerSentiment = async () => {
  await fetchAndSave(INDICATOR_TYPE.CONSUMER_SENTIMENT, async () => {
    return fetchInvestingData({
      url: "https://sbcharts.investing.com/events_charts/us/320.json",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CONSUMER_SENTIMENT,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.INDEX,
    });
  });
};

export const updateBuildingPermits = async () => {
  await fetchAndSave(INDICATOR_TYPE.BUILDING_PERMITS, async () => {
    // TODO: Find Investing.com URL for Building Permits
    return getDataFRED({
      seriesId: "PERMIT",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.THOUSANDS,
    });
  });
};

// ==========================================
// 2. Money Supply
// ==========================================

export const updateMoneySupplyM2 = async () => {
  await fetchAndSave(INDICATOR_TYPE.M2, async () => {
    return getDataFRED({
      seriesId: "M2SL",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.M2,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.BILLIONS,
      currency: Currency.USD,
    });
  });
};

// ==========================================
// 3. Interest Rate
// ==========================================

export const updateInterestRate = async () => {
  await fetchAndSave(INDICATOR_TYPE.IR, async () => {
    return getDataFRED({
      seriesId: "FEDFUNDS",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.IR,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.PERCENT,
    });
  });
};

// ==========================================
// 4. Inflation
// ==========================================

export const updateCPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CPI, async () => {
    return getDataFRED({
      seriesId: "CPIAUCSL",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CPI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.INDEX,
    });
  });
};

export const updateCoreCPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CORE_CPI, async () => {
    return getDataFRED({
      seriesId: "CPILFESL",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CORE_CPI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.INDEX,
    });
  });
};

export const updatePPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.PPI, async () => {
    return getDataFRED({
      seriesId: "WPSFD49207",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.PPI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.INDEX,
    });
  });
};

export const updateCorePPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CORE_PPI, async () => {
    return getDataFRED({
      seriesId: "WPSFD4131",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CORE_PPI,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.INDEX,
    });
  });
};

// ==========================================
// 5. Labor
// ==========================================

export const updateEmploymentChange = async () => {
  await fetchAndSave(INDICATOR_TYPE.EMPLOYMENT_CHANGE, async () => {
    // Non-Farm Payrolls
    return getDataFRED({
      seriesId: "PAYEMS",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.THOUSANDS,
    });
  });
};

export const updateUnemploymentRate = async () => {
  await fetchAndSave(INDICATOR_TYPE.UNEMPLOYMENT_RATE, async () => {
    return getDataFRED({
      seriesId: "UNRATE",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.PERCENT,
    });
  });
};

// ==========================================
// 6. GDP & Govt
// ==========================================

export const updateGDPNominal = async () => {
  await fetchAndSave(INDICATOR_TYPE.GDP_NOMINAL, async () => {
    // TODO: Find Investing.com URL for GDP Nominal
    return getDataFRED({
      seriesId: "GDP",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      frequency: FREQUENCY.MONTHLY,
      unit: UNIT.BILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateGDPGrowth = async () => {
  await fetchAndSave(INDICATOR_TYPE.GDP_GROWTH, async () => {
    // TODO: Find Investing.com URL for GDP Growth
    return getDataFRED({
      seriesId: "A191RL1Q225SBEA",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GDP_GROWTH,
      frequency: FREQUENCY.QUARTERLY,
      unit: UNIT.PERCENT,
    });
  });
};

export const updateGovernmentDebt = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_DEBT, async () => {
    return getDataFRED({
      seriesId: "GFDEBTN",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_DEBT,
      frequency: FREQUENCY.QUARTERLY,
      unit: UNIT.MILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateGovernmentReceipts = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_RECEIPTS, async () => {
    return getDataFRED({
      seriesId: "FYFR",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      frequency: FREQUENCY.YEARLY,
      unit: UNIT.MILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateGovernmentPayments = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_PAYMENTS, async () => {
    return getDataFRED({
      seriesId: "FYONET",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
      frequency: FREQUENCY.YEARLY,
      unit: UNIT.MILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateGovernmentInterestBills = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_INTEREST_BILLS, async () => {
    return getDataFRED({
      seriesId: "FYOINT",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      frequency: FREQUENCY.YEARLY,
      unit: UNIT.MILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateDebtToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.DEBT_TO_GDP, async () => {
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
  });
};

export const updateBudgetSurplusDeficit = async () => {
  await fetchAndSave(INDICATOR_TYPE.SURPLUS_DEFICIT, async () => {
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
          actual_formatted: numberFormatter(surplusDeficit, { unit: 'M' }),
          unit: UNIT.MILLIONS,
          currency: Currency.USD,
        });
      }
    }
    return result;
  });
};

export const updateSurplusDeficitToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP, async () => {
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
  });
};

export const updateInterestBillsToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.INTEREST_BILLS_TO_GDP, async () => {
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
        const interestBillsBillions = convertToBillions(
          interestBills.actual,
          interestBills.unit
        );
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
  });
};

export const updateLiquidityCover = async () => {
  await fetchAndSave(INDICATOR_TYPE.LIQUIDITY_COVER, async () => {
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
  });
};

// ==========================================
// 7. Treasury Yield 10Y
// ==========================================

export const updateTreasuryYield10Y = async () => {
  await fetchAndSave(INDICATOR_TYPE.TREASURY_10_YEAR, async () => {
    return getDataFRED({
      seriesId: "WGS10YR",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.TREASURY_10_YEAR,
      frequency: FREQUENCY.WEEKLY,
      unit: UNIT.PERCENT,
    });
  });
};

// ==========================================
// 8. Central Bank Balance Sheet
// ==========================================

export const updateCentralBankBalanceSheet = async () => {
  await fetchAndSave(INDICATOR_TYPE.CBBS_TOTAL_ASSETS, async () => {
    return getDataFRED({
      seriesId: "WALCL",
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS,
      frequency: FREQUENCY.WEEKLY,
      unit: UNIT.MILLIONS,
      currency: Currency.USD,
    });
  });
};

export const updateCBBSTotalAssetsToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.CBBS_TOTAL_ASSETS_TO_GDP, async () => {
    // 1. Fetch CBBS Total Assets (WEEKLY)
    const cbbsData = await getIndicatorsByType({
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CBBS_TOTAL_ASSETS,
    });
    if (!cbbsData.length) {
      console.warn("No CBBS Total Assets data found.");
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

    // 3. Map GDP by Year-Quarter for easy lookup
    const gdpMap = new Map<string, { actual: number; unit?: UNIT }>();
    gdpData.forEach((item) => {
      const key = getYearQuarter(item.timestamp);
      gdpMap.set(key, { actual: item.actual, unit: item.unit });
    });

    const result: IndicatorValue[] = [];

    // 4. Calculate Ratio (CBBS Total Assets to GDP)
    for (const cbbs of cbbsData) {
      const key = getYearQuarter(cbbs.timestamp);
      const gdpItem = gdpMap.get(key);

      // Must have corresponding GDP data for the same quarter
      if (gdpItem && gdpItem.actual !== 0) {
        // Normalize both to Billions
        const cbbsBillions = convertToBillions(cbbs.actual, cbbs.unit);
        const gdpBillions = convertToBillions(gdpItem.actual, gdpItem.unit);

        // Calculate ratio as percentage
        const ratio = (cbbsBillions / gdpBillions) * 100;

        result.push({
          country: COUNTRY_CODE.USA,
          indicator_type: INDICATOR_TYPE.CBBS_TOTAL_ASSETS_TO_GDP,
          frequency: FREQUENCY.WEEKLY,
          timestamp: cbbs.timestamp,
          actual: parseFloat(ratio.toFixed(2)), // Keep 2 decimals
          actual_formatted: `${numberFormatter(ratio, { decimals: 2 })}%`,
          unit: UNIT.PERCENT,
        });
      }
    }

    return result;
  });
};

// ==========================================
// MASTER RUNNER
// ==========================================

export const updateAllUSAIndicators = async () => {
  console.log("Starting update for all USA indicators...");

  // 1. Production & Consumption
  await updateManufacturingPMI();
  await updateServicesPMI();
  await updateConsumerSentiment();
  await updateBuildingPermits();

  // 2. Money Supply
  await updateMoneySupplyM2();

  // 3. Interest Rate
  await updateInterestRate();

  // 4. Inflation
  await updateCPI();
  await updateCoreCPI();
  await updatePPI();
  await updateCorePPI();

  // 5. Labor
  await updateEmploymentChange();
  await updateUnemploymentRate();

  // 6. GDP & Govt
  await updateGDPNominal();
  await updateGDPGrowth();
  await updateGovernmentDebt();
  await updateGovernmentReceipts();
  await updateGovernmentPayments();
  await updateGovernmentInterestBills();
  await updateDebtToGDP();
  await updateBudgetSurplusDeficit();
  await updateSurplusDeficitToGDP();
  await updateInterestBillsToGDP();
  await updateLiquidityCover();

  // 7. Treasury Yield 10Y
  await updateTreasuryYield10Y();

  // 8. Central Bank
  await updateCentralBankBalanceSheet();
  await updateCBBSTotalAssetsToGDP();

  console.log("Completed update for all USA indicators.");
};
