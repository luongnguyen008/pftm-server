---
trigger: always_on
---

# File Organization

## Directory Structure

```
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
│   │   ├── 01_surveys.ts       # PMI, sentiment, etc.
│   │   ├── 02_money-supply.ts  # M2, M3
│   │   ├── 03_interest-rates.ts # Policy rates
│   │   ├── 04_inflation.ts     # CPI, PPI
│   │   ├── 05_employment.ts    # Labor indicators
│   │   ├── 06_government.ts    # GDP, debt, budget
│   │   ├── 07_treasury-yield.ts # 10Y Yields
│   │   └── 08_cbbs.ts          # Central bank balance sheet
│   └── [country]/              # Repeat structure per country
└── types/
    └── index.ts                # All enums and interfaces
```

## File Naming Conventions

- Use numbered prefixes for service files to enforce a logical update order:
  1. `01_surveys.ts`
  2. `02_money-supply.ts`
  3. `03_interest-rates.ts`
  4. `04_inflation.ts`
  5. `05_employment.ts`
  6. `06_government.ts` (Includes GDP and Debt)
  7. `07_treasury-yield.ts` (Treasury Yields)
  8. `08_cbbs.ts` (Central Bank Balance Sheet)
- Use snake_case with numbered prefix: `01_surveys.ts`.
- Each country folder has identical numbering and structure (see Country Generator below).
- Master runner always named `index.ts`.

## Country Generator

Use the following command to initialize a new country folder based on the example template:

```bash
yarn gen-folder <country_code>
```

Example:
```bash
yarn gen-folder jpn
```

This command will:
1. Create `src/services/<country_code>/`.
2. Copy all files from `src/services/example/`.
3. Rename functions within the files to append the currency suffix (e.g., `updateManufacturingPMI` -> `updateManufacturingPMIJPY`).
4. Replace "Example" with the country name in logs and function names (e.g., `updateAllJapanIndicators`).

## Master Runner Pattern

Each country\s \`index.ts\` should:

1. Import all indicator update functions
2. Export a single \`updateAll[Country]Indicators\` function
3. Call indicators in logical groups with comments
4. Use sequential await (not parallel) for predictable logging
