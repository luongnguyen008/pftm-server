import fs from "fs";
import path from "path";
import pc from "picocolors";
import { COUNTRY_CODE, COUNTRY_LIST } from "../src/types";

/**
 * Script to generate a new country service folder based on 'src/services/example'.
 * 
 * Usage: yarn gen-folder <country_code>
 * Example: yarn gen-folder jpn
 */

async function main() {
  const countryInput = process.argv[2]?.toLowerCase();
  
  if (!countryInput) {
    console.error(pc.red("Error: Please provide a country code (e.g., jpn)"));
    console.log(pc.yellow("Example: yarn gen-folder jpn"));
    process.exit(1);
  }

  const country = COUNTRY_LIST.find((c) => c.code === countryInput);
  if (!country) {
    console.error(pc.red(`Error: Country code "${countryInput}" not found in src/types/index.ts`));
    console.log(pc.cyan("Available codes: ") + COUNTRY_LIST.map(c => c.code).join(", "));
    process.exit(1);
  }

  // Find the enum key for the country code
  const countryEnumKey = Object.keys(COUNTRY_CODE).find(
    (key) => COUNTRY_CODE[key as keyof typeof COUNTRY_CODE] === country.code
  );

  // Per user request: use country name as suffix (jpn -> Japan)
  const suffix = country.name;
  const folderName = country.code;
  const countryName = country.name;

  const sourceDir = path.resolve(__dirname, "../src/services/example");
  const targetDir = path.resolve(__dirname, `../src/services/${countryName.toLowerCase()}`);

  if (fs.existsSync(targetDir)) {
    console.error(pc.red(`Error: Target directory ${targetDir} already exists.`));
    process.exit(1);
  }

  console.log(pc.blue(`Generating new country folder for ${pc.bold(countryName)}...`));
  console.log(pc.dim(`Source: ${sourceDir}`));
  console.log(pc.dim(`Target: ${targetDir}`));
  console.log(pc.dim(`Function Suffix: ${suffix}`));

  fs.mkdirSync(targetDir, { recursive: true });

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    if (fs.lstatSync(sourceFilePath).isDirectory()) continue;

    let content = fs.readFileSync(sourceFilePath, "utf-8");

    // 1. Replace "Example" with the country name (e.g., "Japan") in master runner and strings
    content = content.replace(/Example/g, countryName);

    // 2. Add suffix to exported indicators and their calls
    // Logic: find 'update' followed by words, but NOT 'updateAll...Indicators'
    // We replace 'updateXxx' with 'updateXxxSuffix'
    // We exclude 'updateAll[Country]Indicators'
    const masterRunnerName = `updateAll${countryName}Indicators`;
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

  console.log(pc.green(`\nSuccess! Created ${pc.bold(folderName)} services.`));
  console.log(pc.cyan(`Next steps:`));
  console.log(`1. Explore src/services/${folderName}/index.ts`);
  console.log(`2. Import and call updateAll${countryName}Indicators in src/index.ts`);
}

main().catch(error => {
  console.error(pc.red("An unexpected error occurred:"));
  console.error(error);
  process.exit(1);
});
