---
trigger: always_on
---

# TypeScript Standards

## Type Safety

- Always use proper enum types instead of `any`
- Example: Use `COUNTRY_CODE`, `INDICATOR_TYPE`, `FREQUENCY`, `UNIT`, `Currency` enums
- When mapping database results, cast to specific enum types:
  ```typescript
  country: row.country as COUNTRY_CODE,
  indicator_type: row.indicator_type as INDICATOR_TYPE,
  ```

## Enum Usage Rules

- **NEVER** use string literals for enum values
- Always import and use enum types:

  ```typescript
  // ✅ Correct
  import { COUNTRY_CODE, INDICATOR_TYPE } from "../../types";
  country: COUNTRY_CODE.USA,

  // ❌ Wrong
  country: "usa",
  ```

## Type Casting from Database

When reading from database, always cast to proper types:

```typescript
const result = await db.execute({ sql, args });
return result.rows.map((row) => ({
  country: row.country as COUNTRY_CODE,
  indicator_type: row.indicator_type as INDICATOR_TYPE,
  frequency: row.frequency as FREQUENCY,
  timestamp: Number(row.timestamp),
  actual: Number(row.actual),
  unit: (row.unit as UNIT) || undefined,
  currency: (row.currency as Currency) || undefined,
}));
```

## Function Parameter Types

- Always use enum types in function parameters
- Make optional parameters explicit with `?`
- Example:
  ```typescript
  export const getDataFRED = async ({
    seriesId,
    country,
    indicatorType,
    frequency,
    unit,
    currency,
  }: {
    seriesId: string;
    country: COUNTRY_CODE;
    indicatorType: INDICATOR_TYPE;
    frequency: FREQUENCY;
    unit?: UNIT; // Optional but typed
    currency?: Currency; // Optional but typed
  }): Promise<IndicatorValue[]> => {
    // Implementation
  };
  ```

## Import Organization

### Import Grouping

Organize imports in this exact order:

```typescript
// 1. External libraries
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// 2. Types and interfaces
import {
  COUNTRY_CODE,
  INDICATOR_TYPE,
  FREQUENCY,
  UNIT,
  Currency,
  IndicatorValue,
} from "../../types";

// 3. Common services
import { fetchAndSave } from "../common/helper";
import { getDataFRED } from "../common/fred";
import { upsertIndicators, getIndicatorsByType } from "../common/repository";

// 4. Lib utilities
import { toTimestamp, getYearQuarter } from "../../lib/time";
import { convertToBillions } from "../../lib/utils";

// 5. Local utilities (same directory)
import { calculateDerivedValue } from "./calculations";
```

### Import Formatting

- Use named imports (not default imports for consistency)
- Group related imports in multi-line format
- Sort alphabetically within each group
- Use destructuring for multiple imports from same module
