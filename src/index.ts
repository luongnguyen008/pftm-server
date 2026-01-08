import { logger } from "./lib/logger";
import { updateAllUSAIndicators } from "./services/usa/index";
import { updateAllAustraliaIndicators } from "./services/australia/index";

async function main() {
  logger.header("System Update Started");

  await updateAllUSAIndicators();
  await updateAllAustraliaIndicators();

  logger.header("System Update Completed Successfully");
}

main().catch((error) => {
  logger.error("Critical error in main runner", error);
  process.exit(1);
});
