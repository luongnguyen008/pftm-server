---
trigger: always_on
---

# Date and Time Handling

## Always Use dayjs

- **REQUIRED**: Use `dayjs` for all date/time operations
- Never use native `Date` object for calculations or formatting
- Import: `import dayjs from "dayjs";`
- Examples:

  ```typescript
  // ✅ Correct
  const date = dayjs.unix(timestamp);
  const year = date.year();
  const month = date.month(); // 0-11

  // ❌ Wrong
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  ```

## Timestamp Standards

- Store timestamps as Unix seconds (not milliseconds)
- Use `dayjs.unix(timestamp)` to parse
- Use `date.unix()` to get timestamp

## Matching Data Across Time Periods

- **REQUIRED**: For quarterly data matching, use Year-Quarter keys
- Example:
  ```typescript
  const getYearQuarter = (timestamp: number): string => {
    const date = dayjs.unix(timestamp);
    const month = date.month(); // 0-11
    const quarter = Math.floor(month / 3) + 1;
    return `${date.year()}-Q${quarter}`;
  };
  ```
- Use `Map<string, T>` with Year-Quarter keys instead of exact timestamp matching
- This handles timestamp variations (start vs. end of period)
