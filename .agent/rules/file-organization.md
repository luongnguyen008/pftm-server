---
trigger: always_on
---

# File Organization

## Directory Structure

\`\`\`
src/
├── lib/                        # Pure utility functions
│   ├── db.ts                   # Database connection
│   ├── time.ts                 # Date/time utilities
│   ├── utils.ts                # General utilities
│   ├── number-formatter.ts     # Number formatting
│   └── cache.ts                # Caching utilities
├── services/
│   ├── common/                 # Shared service utilities
│   │   ├── repository.ts       # Database operations
│   │   ├── helper.ts           # Service helpers
│   │   ├── fred.ts            # FRED API client
│   │   ├── investing.ts       # Investing.com client
│   │   ├── mql5.ts            # Web scraping utilities
│   │   └── puppeteer-client.ts # Browser automation
│   ├── usa/                    # Country-specific services
│   │   ├── index.ts           # Master runner
│   │   ├── 1. surveys.ts       # PMI, sentiment, etc.
│   │   ├── 2. money-supply.ts  # M2, M3
│   │   ├── 3. interest-rates.ts # Policy rates
│   │   ├── 4. inflation.ts     # CPI, PPI
│   │   ├── 5. employment.ts    # Labor indicators
│   │   ├── 6. government.ts    # GDP, debt, budget
│   │   ├── 7. treasury-yield.ts # 10Y Yields
│   │   └── 8. cbbs.ts          # Central bank balance sheet
│   └── [country]/              # Repeat structure per country
└── types/
    └── index.ts                # All enums and interfaces
\`\`\`

## File Naming Conventions

- Use numbered prefixes for service files to enforce a logical update order:
  1. \`1. surveys.ts\`
  2. \`2. money-supply.ts\`
  3. \`3. interest-rates.ts\`
  4. \`4. inflation.ts\`
  5. \`5. employment.ts\`
  6. \`6. government.ts\` (GDP, Debt, Fiscal ratios)
  7. \`7. treasury-yield.ts\` (Treasury Yields)
  8. \`8. cbbs.ts\` (Central Bank Balance Sheet)
- Use kebab-case for the descriptive part of the filename.
- Each country folder has identical numbering and structure.
- Master runner always named \`index.ts\`.

## Helper Functions

- Place all utility functions in \`src/lib/\` directory
- Examples: \`lib/utils.ts\` for general utilities, \`lib/time.ts\` for date/time functions
- Import utilities from lib: \`import { getYearQuarter, convertToBillions } from "../../lib/utils"\`
- Use descriptive names: \`convertToBillions\`, \`getYearQuarter\`
- Keep helpers focused and reusable
- Add JSDoc comments for utility functions

## Master Runner Pattern

Each country\s \`index.ts\` should:

1. Import all indicator update functions
2. Export a single \`updateAll[Country]Indicators\` function
3. Call indicators in logical groups with comments
4. Use sequential await (not parallel) for predictable logging

Example:

\`\`\`typescript
export const updateAllUSAIndicators = async () => {
  console.log("Starting update for all USA indicators...");

  // 1. Production & Consumption
  await updateManufacturingPMI();
  await updateServicesPMI();

  // 2. Money Supply
  await updateMoneySupplyM2();

  // ... more groups

  console.log("Completed update for all USA indicators.");
};
\`\`\`

## Code Duplication Prevention

### DRY Principles

- Extract repeated logic into utility functions in \`lib/\`
- Use common service utilities in \`services/common/\`
- Never copy-paste indicator update functions across countries
- If 3+ files have similar code, extract to shared utility

### Pattern Recognition

Watch for these duplication smells:

- Same calculation logic in multiple files → Extract to \`lib/utils.ts\`
- Same API call pattern → Create reusable function in \`services/common/\`
- Same data transformation → Create utility function
- Same validation logic → Extract to shared validator

### Refactoring Checklist

Before writing new code, ask:

1. Does this logic exist elsewhere?
2. Could this be generalized for reuse?
3. Should this live in \`lib/\` or \`services/common/\`?
4. Will other countries need this same function?
