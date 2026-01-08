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
- Automatically handles batching, transactions, and conflict resolution
- Logs results to console using the centralized `logger`

### `getIndicatorsByType` Function

- Use for retrieving stored indicator data (e.g., for derived calculations)
- Returns array sorted by timestamp ASC

## Derived Indicator Pattern

### Standard Manual Calculation
For complex derived indicators (e.g., DEBT_TO_GDP):

```typescript
export const updateDerivedIndicator = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.DERIVED,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // 1. Fetch source data
      const sourceData = await getIndicatorsByType({ ... });
      
      // 2. Perform calculations
      // 3. Return mapped IndicatorValue[]
    }
  });
};
```

### Percentage Change Calculation (Generic)
**REQUIRED**: Use the `calculateChange` utility from `src/lib/utils.ts` for simple sequential percentage changes (e.g., Inflation change, Employment growth).

```typescript
import { calculateChange } from "../../lib/utils";

export const updateChangeIndicator = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      const sourceData = await getIndicatorsByType({ ... });
      if (sourceData.length === 0) return [];

      return calculateChange(sourceData, INDICATOR_TYPE.CHANGE, COUNTRY_CODE.USA);
    }
  });
};
```

## Using `services/common/mql5.ts` and `puppeteer-client.ts`

- Use for web scraping when data is not available via API
- `PuppeteerClient` class encapsulates browser launching and page configuration
- Always clean up resources (close browser) in finally blocks

## Required Fields

- Always specify `unit` for new indicators
- Add `currency` for all monetary values
- Use appropriate `frequency` (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY)
