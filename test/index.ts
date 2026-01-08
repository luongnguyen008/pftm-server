import { updateAllAustraliaIndicators } from "../src/services/australia/index";

(async () => {
  try {
    await updateAllAustraliaIndicators();
  } catch (error) {
    console.error("Test failed:", error);
  }
})();


