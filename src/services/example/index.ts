import {
  updateBuildingPermits,
  updateConsumerSentiment,
  updateManufacturingPMI,
  updateServicesPMI,
} from "./01_surveys";
import { updateMoneySupplyM2 } from "./02_money-supply";
import { updateInterestRate } from "./03_interest-rates";
import { updateCoreCPI, updateCorePPI, updateCPI, updatePPI } from "./04_inflation";
import { updateEmploymentChange, updateUnemploymentRate } from "./05_employment";
import {
  updateBudgetSurplusDeficit,
  updateDebtToGDP,
  updateGDPGrowth,
  updateGDPNominal,
  updateGovernmentDebt,
  updateGovernmentInterestBills,
  updateGovernmentPayments,
  updateGovernmentReceipts,
  updateInterestBillsToGDP,
  updateLiquidityCover,
  updateSurplusDeficitToGDP,
} from "./06_government";
import { updateTreasuryYield10Y } from "./07_treasury-yield";
import { updateCBBSTotalAssetsToGDP, updateCentralBankBalanceSheet } from "./08_cbbs";
import { logger } from "../../lib/logger";

// ==========================================
// MASTER RUNNER
// ==========================================

export const updateAllExampleIndicators = async () => {
  logger.info("Starting update for all Example indicators...", "EXAMPLE");

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

  logger.info("Completed update for all Example indicators.", "EXAMPLE");
};
