import {
  updateBuildingPermitsAustralia,
  updateConsumerSentimentAustralia,
  updateManufacturingPMIAustralia,
  updateServicesPMIAustralia,
} from "./01. surveys";
import { updateMoneySupplyM3ChangeAustralia } from "./02. money-supply";
import { updateInterestRateAustralia } from "./03. interest-rates";
import { updateCoreCPIAustralia, updateCorePPIAustralia, updateCPIAustralia, updatePPIAustralia } from "./04. inflation";
import { updateEmploymentChangeAustralia, updateUnemploymentRateAustralia } from "./05. employment";
import {
  updateBudgetSurplusDeficitAustralia,
  updateDebtToGDPAustralia,
  updateGDPGrowthAustralia,
  updateGDPNominalAustralia,
  updateInterestBillsToGDPAustralia,
  updateLiquidityCoverAustralia,
  updatePboAustraliaIndicatorsAustralia,
  updateSurplusDeficitToGDPAustralia,
} from "./06. government";
import { updateTreasuryYield10YAustralia } from "./07_treasury-yield";
import { updateCentralBankBalanceSheetAustralia, updateCBBSTotalAssetsToGDPAustralia } from "./08_cbbs";

// ==========================================
// MASTER RUNNER
// ==========================================

export const updateAllAustraliaIndicators = async () => {
  console.log("Starting update for all Australia indicators...");

  // 1. Production & Consumption
  await updateManufacturingPMIAustralia();
  await updateServicesPMIAustralia();
  await updateConsumerSentimentAustralia();
  await updateBuildingPermitsAustralia();

  // 2. Money Supply
  await updateMoneySupplyM3ChangeAustralia();

  // 3. Interest Rate
  await updateInterestRateAustralia();

  // 4. Inflation
  await updateCPIAustralia();
  await updateCoreCPIAustralia();
  await updatePPIAustralia();
  await updateCorePPIAustralia();

  // 5. Labor
  await updateEmploymentChangeAustralia();
  await updateUnemploymentRateAustralia();

  // 6. GDP & Govt
  await updateGDPNominalAustralia();
  await updateGDPGrowthAustralia();

  await updatePboAustraliaIndicatorsAustralia(); // Get Debt / Receipts / Payments / Interest Bills from PBO
  
  await updateDebtToGDPAustralia();
  await updateBudgetSurplusDeficitAustralia();
  await updateSurplusDeficitToGDPAustralia();
  await updateInterestBillsToGDPAustralia();
  await updateLiquidityCoverAustralia();

  // 7. Treasury Yield 10Y
  await updateTreasuryYield10YAustralia();

  // 8. Central Bank
  await updateCentralBankBalanceSheetAustralia();
  await updateCBBSTotalAssetsToGDPAustralia();

  console.log("Completed update for all Australia indicators.");
};
