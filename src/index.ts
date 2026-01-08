import { updateAllUSAIndicators } from "./services/usa/index";
import { updateAllAustraliaIndicators } from "./services/australia/index";

async function main() {
  await updateAllUSAIndicators();
  await updateAllAustraliaIndicators();
}

main();
