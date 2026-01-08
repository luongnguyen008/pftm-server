import {
  updateBuildingPermitsUSA,
  updateConsumerSentimentUSA,
  updateManufacturingPMIUSA,
  updateServicesPMIUSA,
} from "./01_surveys";
import { updateMoneySupplyM2USA } from "./02_money-supply";
import { updateInterestRateUSA } from "./03_interest-rates";
import { updateCoreCPIUSA, updateCorePPIUSA, updateCPIUSA, updatePPIUSA } from "./04_inflation";
import { updateEmploymentChangeUSA, updateUnemploymentRateUSA } from "./05_employment";
import {
  updateBudgetSurplusDeficitUSA,
  updateDebtToGDPUSA,
  updateGDPGrowthUSA,
  updateGDPNominalUSA,
  updateGovernmentDebtUSA,
  updateGovernmentInterestBillsUSA,
  updateGovernmentPaymentsUSA,
  updateGovernmentReceiptsUSA,
  updateInterestBillsToGDPUSA,
  updateLiquidityCoverUSA,
  updateSurplusDeficitToGDPUSA,
} from "./06_government";
import { updateTreasuryYield10YUSA } from "./07_treasury-yield";
import { updateCBBSTotalAssetsToGDPUSA, updateCentralBankBalanceSheetUSA } from "./08_cbbs";

// ==========================================
// MASTER RUNNER
// ==========================================

export const updateAllUSAIndicators = async () => {
  console.log("Starting update for all USA indicators...");

  // 1. Production & Consumption
  await updateManufacturingPMIUSA();
  await updateServicesPMIUSA();
  await updateConsumerSentimentUSA();
  await updateBuildingPermitsUSA();

  // 2. Money Supply
  await updateMoneySupplyM2USA();

  // 3. Interest Rate
  await updateInterestRateUSA();

  // 4. Inflation
  await updateCPIUSA();
  await updateCoreCPIUSA();
  await updatePPIUSA();
  await updateCorePPIUSA();

  // 5. Labor
  await updateEmploymentChangeUSA();
  await updateUnemploymentRateUSA();

  // 6. GDP & Govt
  await updateGDPNominalUSA();
  await updateGDPGrowthUSA();
  await updateGovernmentDebtUSA();
  await updateGovernmentReceiptsUSA();
  await updateGovernmentPaymentsUSA();
  await updateGovernmentInterestBillsUSA();
  await updateDebtToGDPUSA();
  await updateBudgetSurplusDeficitUSA();
  await updateSurplusDeficitToGDPUSA();
  await updateInterestBillsToGDPUSA();
  await updateLiquidityCoverUSA();

  // 7. Treasury Yield 10Y
  await updateTreasuryYield10YUSA();

  // 8. Central Bank
  await updateCentralBankBalanceSheetUSA();
  await updateCBBSTotalAssetsToGDPUSA();

  console.log("Completed update for all USA indicators.");
};
