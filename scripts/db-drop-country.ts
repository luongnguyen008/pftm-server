import { deleteByCountry } from "../src/services/common/repository";
import { logger } from "../src/lib/logger";

/**
 * Script to drop all indicator data for a specific country.
 *
 * Usage: yarn drop-country <country_code>
 * Example: yarn drop-country aus
 */

const main = async () => {
  const country = process.argv[2];

  if (!country) {
    logger.error("Please provide a country code.", null, "DROP-COUNTRY");
    logger.info("Example: yarn drop-country aus", "DROP-COUNTRY");
    process.exit(1);
  }

  logger.header(`Dropping all indicators for country: ${country}...`);

  try {
    const deletedCount = await deleteByCountry(country);
    logger.success(`Successfully deleted ${deletedCount} records.`, "DROP-COUNTRY");
    process.exit(0);
  } catch (error) {
    logger.error(`Failed to drop country data for ${country}`, error, "DROP-COUNTRY");
    process.exit(1);
  }
};

main();
