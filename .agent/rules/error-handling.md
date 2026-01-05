---
trigger: always_on
---

# Error Handling

## Logging Format

- Use consistent log format: `[SERVICE] Action description`
- Examples:
  ```typescript
  console.log(`[USA] Fetching ${indicatorType}...`);
  console.warn("No Government Debt data found.");
  console.error("Error upserting indicators:", error);
  ```

## Error Logging

- Use `[SERVICE_NAME]` prefix in square brackets
- Include context about what failed
- Examples:
  ```typescript
  console.error("[USA] Error fetching PMI data:", error);
  console.error("[AUSTRALIA] Error calculating debt ratio:", error);
  console.error("[REPOSITORY] Error upserting indicators:", error);
  ```

## Try-Catch Patterns

- Wrap all async operations in try-catch
- **REQUIRED**: Always use consistent error logging format
- Never swallow errors silently
- Example:
  ```typescript
  try {
    const data = await fetchData();
    await processData(data);
  } catch (error) {
    console.error("[SERVICE_NAME] Error description:", error);
    throw error; // Re-throw for caller to handle
  }
  ```

## Data Validation

- Check for empty datasets before processing
- Return early with empty arrays when prerequisites aren't met
- Use transactions for database operations

## Graceful Degradation

- Return empty arrays for missing data, don't throw
- Log warnings for non-critical issues
- Example:
  ```typescript
  if (sourceData.length === 0) {
    console.warn("[USA] No data found for GDP calculation");
    return; // Exit gracefully
  }
  ```

## Async/Await

- Always use async/await over promises
- Handle errors with try/catch blocks
- Use transactions for multi-step database operations

## Data Quality

- Validate timestamp alignment for derived indicators
- Check for zero division before calculations
- Handle missing or null data gracefully

## Console Logging

- Log record counts for transparency
- Log both inserted and updated counts separately
- Include service name in brackets for easy filtering
