# Error Handling

## Centralized Logger (REQUIRED)

- **REQUIRED**: All console output MUST use the centralized `logger` utility from `src/lib/logger.ts`.
- **NEVER** use direct `console.log`, `console.warn`, or `console.error`.

## Logging Patterns

### Informational and Service Messages
Use `logger.info` for general progress or `logger.service` for specific service-level actions.

```typescript
import { logger } from "../../lib/logger";

logger.info("Fetching indicators...", "USA");
logger.service("ABS", "Downloading file...");
```

### Success and Results
Use `logger.success` for successful completions and record counts.

```typescript
logger.success(`Saved ${indicators.length} records for ${indicatorType}`, "USA");
```

### Warnings and Errors
Use `logger.warn` for non-critical issues and `logger.error` for failures.

```typescript
logger.warn("No data found for calculation", "USA");
logger.error("Error fetching PMI data", error, "USA");
```

## Try-Catch Patterns

- Wrap all async operations in try-catch
- **REQUIRED**: Always use consistent error logging via `logger.error`
- Never swallow errors silently

```typescript
try {
  const data = await fetchData();
  await processData(data);
} catch (error) {
  logger.error("Failed to process indicator data", error, "SERVICE_NAME");
  throw error; // Re-throw for caller to handle
}
```

## Console Logging Standards

- Log record counts for transparency
- Log both inserted and updated counts separately
- Always specify the service name as the second or third argument to the logger method for consistent prefixing.
