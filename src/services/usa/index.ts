import {
  COUNTRY_CODE,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
} from "../../types";
import { upsertIndicators } from "../common/repository";
import { fetchInvestingData } from "../common/investing";
import { getDataFRED } from "../common/fred";

// Helper function template to standardize fetching and saving
const fetchAndSave = async (
  indicatorType: INDICATOR_TYPE,
  fetchLogic: () => Promise<IndicatorValue[]>,
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
      });
  });
};

export const updateBuildingPermits = async () => {
  await fetchAndSave(INDICATOR_TYPE.BUILDING_PERMITS, async () => {
    // TODO: Find Investing.com URL for Building Permits
    return getDataFRED({
      seriesId: 'PERMIT',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

// ==========================================
// 2. Money Supply
// ==========================================

export const updateMoneySupplyM2 = async () => {
  await fetchAndSave(INDICATOR_TYPE.M2, async () => {
    return getDataFRED({
      seriesId: 'M2SL',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.M2,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};


// ==========================================
// 3. Interest Rate
// ==========================================

export const updateInterestRate = async () => {
  await fetchAndSave(INDICATOR_TYPE.IR, async () => {
    return getDataFRED({
      seriesId: 'FEDFUNDS',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.IR,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

// ==========================================
// 4. Inflation
// ==========================================

export const updateCPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CPI, async () => {
    return getDataFRED({
      seriesId: 'CPIAUCSL',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CPI,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

export const updateCoreCPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CORE_CPI, async () => {
    return getDataFRED({
      seriesId: 'CPILFESL',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CORE_CPI,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

export const updatePPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.PPI, async () => {
    return getDataFRED({
      seriesId: 'WPSFD49207',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.PPI,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

export const updateCorePPI = async () => {
  await fetchAndSave(INDICATOR_TYPE.CORE_PPI, async () => {
    return getDataFRED({
      seriesId: 'WPSFD4131',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.CORE_PPI,
      frequency: FREQUENCY.MONTHLY,
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
      seriesId: 'PAYEMS',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.EMPLOYMENT_CHANGE,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

export const updateUnemploymentRate = async () => {
  await fetchAndSave(INDICATOR_TYPE.UNEMPLOYMENT_RATE, async () => {
    return getDataFRED({
      seriesId: 'UNRATE',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.UNEMPLOYMENT_RATE,
      frequency: FREQUENCY.MONTHLY,
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
      seriesId: 'GDP',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GDP_NOMINAL,
      frequency: FREQUENCY.MONTHLY,
    });
  });
};

export const updateGDPGrowth = async () => {
  await fetchAndSave(INDICATOR_TYPE.GDP_GROWTH, async () => {
    // TODO: Find Investing.com URL for GDP Growth
    return getDataFRED({
      seriesId: 'A191RL1Q225SBEA',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GDP_GROWTH,
      frequency: FREQUENCY.QUARTERLY,
    });
  });
};

export const updateGovernmentDebt = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_DEBT, async () => {
    return getDataFRED({
      seriesId: 'GFDEBTN',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_DEBT,
      frequency: FREQUENCY.QUARTERLY,
    });
  });
};

export const updateGovernmentReceipts = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_RECEIPTS, async () => {
    return getDataFRED({
      seriesId: 'FYFR',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_RECEIPTS,
      frequency: FREQUENCY.YEARLY,
    });
  });
};

export const updateGovernmentPayments = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_PAYMENTS, async () => {
    return getDataFRED({
      seriesId: 'FYONET',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_PAYMENTS,
      frequency: FREQUENCY.YEARLY,
    });
  });
};

export const updateGovernmentInterestBills = async () => {
  await fetchAndSave(INDICATOR_TYPE.GOVT_INTEREST_BILLS, async () => {
    return getDataFRED({
      seriesId: 'FYOINT',
      country: COUNTRY_CODE.USA,
      indicatorType: INDICATOR_TYPE.GOVT_INTEREST_BILLS,
      frequency: FREQUENCY.YEARLY,
    });
  });
};

export const updateDebtToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.DEBT_TO_GDP, async () => {
    // Debt to GDP, get from database Debt, then g
    return []
  });
};

export const updateBudgetSurplusDeficit = async () => {
  await fetchAndSave(INDICATOR_TYPE.SURPLUS_DEFICIT, async () => {
    return [];
  });
};

export const updateSurplusDeficitToGDP = async () => {
  await fetchAndSave(INDICATOR_TYPE.SURPLUS_DEFICIT_TO_GDP, async () => {
    return [];
  });
};

export const updateLiquidityCover = async () => {
    await fetchAndSave(INDICATOR_TYPE.LIQUIDITY_COVER, async () => {
        return [];
    });
};


// ==========================================
// 7. Treasury Yield 10Y
// ==========================================

export const updateTreasuryYield10Y = async () => {
  await fetchAndSave(INDICATOR_TYPE.TREASURY_10_YEAR, async () => {
    return [];
  });
};


// ==========================================
// 8. Central Bank Balance Sheet
// ==========================================

export const updateCentralBankBalanceSheet = async () => {
  await fetchAndSave(INDICATOR_TYPE.CBBS_TOTAL_ASSETS, async () => {
    return [];
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
  await updateLiquidityCover();

  // 7. Treasury Yield 10Y
  await updateTreasuryYield10Y();

  // 8. Central Bank
  await updateCentralBankBalanceSheet();

  console.log("Completed update for all USA indicators.");
};
