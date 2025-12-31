import { updateCBBSTotalAssetsToGDP, updateCentralBankBalanceSheet } from "./cbbs";
import { updateEmploymentChange, updateUnemploymentRate } from "./employment";
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
    updateTreasuryYield10Y,
} from "./government";
import { updateCoreCPI, updateCorePPI, updateCPI, updatePPI } from "./inflation";
import { updateInterestRate } from "./interest-rates";
import { updateMoneySupplyM2 } from "./money-supply";
import {
    updateBuildingPermits,
    updateConsumerSentiment,
    updateManufacturingPMI,
    updateServicesPMI,
} from "./surveys";

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