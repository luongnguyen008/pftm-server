---
trigger: always_on
---

# Database Standards

## Schema Design

- Always include `unit` and `currency` fields for financial/economic indicators
- Use `created_at` and `updated_at` with `unixepoch()` default
- Define composite PRIMARY KEYs for uniqueness

## Unit Handling

- Always specify `unit` when creating indicator data
- Use the `UNIT` enum: `BILLIONS`, `MILLIONS`, `THOUSANDS`, `PERCENT`, `INDEX`
- Add `currency` field when applicable (use `Currency` enum)

## Data Normalization

- Create helper functions for unit conversions (e.g., `convertToBillions`)
- Use switch statements for unit-based logic
- Handle missing units gracefully with sensible defaults

## Unit Conversion for Calculations

- Always normalize units before mathematical operations
- Document the expected units in comments
- Example:
  ```typescript
  // GOVT_DEBT: Millions, GDP_NOMINAL: Billions
  const debtBillions = convertToBillions(debt.actual, debt.unit);
  const gdpBillions = convertToBillions(gdp.actual, gdp.unit);
  const ratio = (debtBillions / gdpBillions) * 100;
  ```

## Repository Pattern

### Data Insertion Rules

- **NEVER** directly execute INSERT/UPDATE SQL in service files
- Always use `upsertIndicators` from `services/common/repository.ts`
- Let the repository handle:
  - Batch size management
  - Transaction boundaries
  - Conflict resolution (ON CONFLICT)
  - Timestamp management (`created_at`, `updated_at`)

### Data Retrieval Rules

- Use `getIndicatorsByType` for simple queries
- For complex queries (JOINs, aggregations), create new functions in `repository.ts`
- Always type-cast database results to proper enums

### Insert vs Update Tracking

- Use `RETURNING created_at, updated_at` in upsert queries
- Compare timestamps to distinguish inserts from updates:
  ```typescript
  if (createdAt === updatedAt) {
    insertedCount++;
  } else {
    updatedCount++;
  }
  ```

## Number Formatting

### When to Use `number-formatter.ts`

Use the utilities from `lib/number-formatter.ts` for:

1. **User-facing output** (UI, reports, exports)
2. **Currency display** - Use `currencyFormatter`
3. **Percentage display** - Use `percentFormatter`
4. **Compact notation** - Use `compactFormatter` (1K, 1M, 1B)
5. **Custom formatting needs** - Use `numberFormatter` with options

### When NOT to Use Formatting

- **Database storage** - Store raw numbers only
- **Internal calculations** - Work with raw numbers
- **API responses** - Usually send raw numbers (format on frontend)

### Storage vs Display

```typescript
// ✅ Correct: Store raw, format for display
const indicator = {
  actual: 1234567.89, // Raw number
  actual_formatted: currencyFormatter(1234567.89, { currency: "USD" }),
};

// ❌ Wrong: Don't format for storage
const indicator = {
  actual: "$1,234,567.89", // Never store formatted strings as actual
};
```
