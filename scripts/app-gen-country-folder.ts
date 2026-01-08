import fs from "fs";
import path from "path";
import pc from "picocolors";
import { COUNTRY_CODE, COUNTRY_LIST } from "../src/types";
import { logger } from "../src/lib/logger";

/**
 * Script to generate a new country service folder based on 'src/services/example'.
 * 
 * Usage: yarn gen-folder <country_code>
 * Example: yarn gen-folder jpn
 */

async function main() {
  const countryInput = process.argv[2]?.toLowerCase();
  
  if (!countryInput) {
    logger.error("Please provide a country code (e.g., jpn)", null, "GEN-FOLDER");
    logger.info("Example: yarn gen-folder jpn", "GEN-FOLDER");
    process.exit(1);
  }

  const country = COUNTRY_LIST.find((c) => c.code === countryInput);
  if (!country) {
    logger.error(`Country code "${countryInput}" not found in src/types/index.ts`, null, "GEN-FOLDER");
    logger.info("Available codes: " + COUNTRY_LIST.map(c => c.code).join(", "), "GEN-FOLDER");
    process.exit(1);
  }

  // Find the enum key for the country code
  const countryEnumKey = Object.keys(COUNTRY_CODE).find(
    (key) => COUNTRY_CODE[key as keyof typeof COUNTRY_CODE] === country.code
  );

  // Per user request: use country name as suffix (jpn -> Japan)
  const suffix = country.name.replace(" ", "");
  const folderName = country.name.toLowerCase().replace(" ", "-");
  const countryName = country.name;
  
  const sourceDir = path.resolve(__dirname, "../src/services/example");
  const targetDir = path.resolve(__dirname, `../src/services/${folderName}`);

  if (fs.existsSync(targetDir)) {
    console.error(pc.red(`Error: Target directory ${targetDir} already exists.`));
    process.exit(1);
  }

  logger.header(`Generating new country folder for ${countryName}...`);
  logger.info(`Source: ${sourceDir}`, "GEN-FOLDER");
  logger.info(`Target: ${targetDir}`, "GEN-FOLDER");
  logger.info(`Function Suffix: ${suffix}`, "GEN-FOLDER");

  fs.mkdirSync(targetDir, { recursive: true });

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    if (fs.lstatSync(sourceFilePath).isDirectory()) continue;

    let content = fs.readFileSync(sourceFilePath, "utf-8");

    // 1. Replace "Example" with the country name (e.g., "Japan") in master runner and strings
    content = content.replace(/Example/g, suffix);

    // 2. Add suffix to exported indicators and their calls
    // Logic: find 'update' followed by words, but NOT 'updateAll...Indicators'
    // We replace 'updateXxx' with 'updateXxxSuffix'
    // We exclude 'updateAll[Country]Indicators'
    const masterRunnerName = `updateAll${suffix}Indicators`;
    content = content.replace(/update([A-Z][a-zA-Z0-9]+)/g, (match) => {
      if (match === masterRunnerName || match === 'updateAllExampleIndicators') {
        return masterRunnerName;
      }
      return `${match}${suffix}`;
    });

    // 3. Optional: replace COUNTRY_CODE placeholders if they exist
    // In current example files, they are mostly empty, but good for future proofing
    if (countryEnumKey) {
      content = content.replace(/COUNTRY_CODE\.EXAMPLE/g, `COUNTRY_CODE.${countryEnumKey}`);
    }

    fs.writeFileSync(targetFilePath, content);
  }

  logger.success(`Created ${folderName} services.`, "GEN-FOLDER");
  logger.info("Next steps:", "GEN-FOLDER");
  logger.info(`1. Explore src/services/${folderName}/index.ts`, "GEN-FOLDER");
  logger.info(`2. Import and call updateAll${suffix}Indicators in src/index.ts`, "GEN-FOLDER");
}

main().catch(error => {
  logger.error("An unexpected error occurred in GEN-FOLDER", error, "GEN-FOLDER");
  process.exit(1);
});
