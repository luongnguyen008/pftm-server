import { deleteByCountry } from "../services/common/repository";
import pc from "picocolors";

const main = async () => {
  const country = process.argv[2];

  if (!country) {
    console.error("Please provide a country code. Example: yarn drop-country aus");
    process.exit(1);
  }

  console.log(`[DROP-COUNTRY] Dropping all indicators for country: ${country}...`);

  try {
    const deletedCount = await deleteByCountry(country);
    console.log(pc.green(`[DROP-COUNTRY] Successfully deleted ${deletedCount} records.`));
    process.exit(0);
  } catch (error) {
    console.error("[DROP-COUNTRY] Failed to drop country data:", error);
    process.exit(1);
  }
};

main();
