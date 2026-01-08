import { updateCBBSTotalAssetsToGDP, updateCentralBankBalanceSheet } from "./8. cbbs";
import { updateEmploymentChange, updateUnemploymentRate } from "./5. employment";
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
} from "./6. government";
import { updateTreasuryYield10Y } from "./7. treasury-yield";
import { updateCoreCPI, updateCorePPI, updateCPI, updatePPI } from "./4. inflation";
import { updateInterestRate } from "./3. interest-rates";
import { updateMoneySupplyM2 } from "./2. money-supply";
import {
  updateBuildingPermits,
  updateConsumerSentiment,
  updateManufacturingPMI,
  updateServicesPMI,
} from "./1. surveys";

// ==========================================
// MASTER RUNNER
// ==========================================

export const updateAllExampleIndicators = async () => {
  console.log("Starting update for all Example indicators...");

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

  console.log("Completed update for all Example indicators.");
};
