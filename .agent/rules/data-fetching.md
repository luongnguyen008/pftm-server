---
trigger: always_on
---

# Data Fetching Patterns

## Using `services/common/helper.ts`

### `fetchAndSave` Function

- **REQUIRED**: Use `fetchAndSave` for all indicator data fetching operations
- This function provides consistent logging and error handling
- Pattern:

  ```typescript
  import { fetchAndSave } from "../common/helper";

  export const updateIndicatorName = async () => {
    await fetchAndSave({
      indicatorType: INDICATOR_TYPE.EXAMPLE,
      country: COUNTRY_CODE.USA,
      fetchLogic: async () => {
        return getDataFRED({
          seriesId: "SERIES_ID",
          country: COUNTRY_CODE.USA,
          indicatorType: INDICATOR_TYPE.EXAMPLE,
          frequency: FREQUENCY.MONTHLY,
          unit: UNIT.BILLIONS,
          currency: Currency.USD,
        });
      },
    });
  };
  ```

- The `fetchLogic` parameter MUST return `Promise<IndicatorValue[]>`
- Never bypass `fetchAndSave` to call `upsertIndicators` directly from service files

## Using `services/common/repository.ts`

### `upsertIndicators` Function

- **ONLY** call from `fetchAndSave` or derived indicator calculations
- Never call directly from individual indicator service files
- Automatically handles:
  - Batching (100 records per batch)
  - Transactions
  - Insert vs Update tracking
  - Conflict resolution
- Returns void, logs results to console

### `getIndicatorsByType` Function

- Use for retrieving stored indicator data (e.g., for derived calculations)
- Returns array sorted by timestamp ASC
- Example:
  ```typescript
  const debtData = await getIndicatorsByType({
    country: COUNTRY_CODE.USA,
    indicatorType: INDICATOR_TYPE.GOVT_DEBT,
  });
  ```

## Using `services/common/fred.ts`

### `getDataFRED` Function

- **REQUIRED**: Use for all FRED API data fetching
- Always specify all required parameters:
  - `seriesId`: FRED series identifier
  - `country`: COUNTRY_CODE enum value
  - `indicatorType`: INDICATOR_TYPE enum value
  - `frequency`: FREQUENCY enum value
  - `unit`: UNIT enum value (optional but recommended)
  - `currency`: Currency enum value (for monetary indicators)
- Returns `Promise<IndicatorValue[]>` ready for `upsertIndicators`
- Handles pagination automatically
- Converts date strings to Unix timestamps

## Using `services/common/investing.ts`

- Use for indicators not available in FRED
- Follow similar pattern to `getDataFRED`
- Returns `Promise<IndicatorValue[]>`

## Using `services/common/mql5.ts` and `puppeteer-client.ts`

- Use for web scraping when data is not available via API
- `PuppeteerClient` class encapsulates browser launching and page configuration
- Always clean up resources (close browser) in finally blocks
- Example pattern:
  ```typescript
  const client = new PuppeteerClient();
  try {
    const page = await client.launch(url);
    // Scraping logic...
  } finally {
    await client.close();
  }
  ```

## Standard Indicator Fetching Template

Every indicator service file should follow this pattern:

```typescript
import { fetchAndSave } from "../common/helper";
import { getDataFRED } from "../common/fred";
import { COUNTRY_CODE, INDICATOR_TYPE, FREQUENCY, UNIT, Currency } from "../../types";

export const updateIndicatorName = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.EXAMPLE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "FRED_SERIES_ID",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.EXAMPLE,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.BILLIONS,
        currency: Currency.USD, // Only for monetary indicators
      });
    },
  });
};
```

## Derived Indicator Pattern

For calculated indicators (e.g., DEBT_TO_GDP):

```typescript
export const updateDerivedIndicator = async () => {
  console.log("[COUNTRY] Calculating DERIVED_INDICATOR...");

  // 1. Fetch required source data
  const sourceData1 = await getIndicatorsByType({
    country: COUNTRY_CODE.USA,
    indicatorType: INDICATOR_TYPE.SOURCE1,
  });

  const sourceData2 = await getIndicatorsByType({
    country: COUNTRY_CODE.USA,
    indicatorType: INDICATOR_TYPE.SOURCE2,
  });

  // 2. Check for empty datasets
  if (sourceData1.length === 0 || sourceData2.length === 0) {
    console.warn("Insufficient data for calculation");
    return;
  }

  // 3. Match data by timestamp/quarter
  const map1 = new Map(sourceData1.map((item) => [getYearQuarter(item.timestamp), item]));

  // 4. Calculate derived values
  const derivedData: IndicatorValue[] = sourceData2
    .map((item2) => {
      const key = getYearQuarter(item2.timestamp);
      const item1 = map1.get(key);

      if (!item1) return null;

      // Perform calculation with unit conversion
      const value = calculateDerived(item1, item2);

      return {
        country: COUNTRY_CODE.USA,
        indicator_type: INDICATOR_TYPE.DERIVED,
        frequency: FREQUENCY.QUARTERLY,
        timestamp: item2.timestamp,
        actual: value,
        unit: UNIT.PERCENT,
      };
    })
    .filter((item): item is IndicatorValue => item !== null);

  // 5. Save results
  await upsertIndicators(derivedData);
  console.log(`[COUNTRY] Calculated ${derivedData.length} derived records`);
};
```

## Required Fields

- Always specify `unit` for new indicators
- Add `currency` for all monetary values
- Use appropriate `frequency` (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY)
