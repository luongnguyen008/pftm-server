---
trigger: always_on
---

# Code Formatting

## Prettier

- **REQUIRED**: All code must be formatted with Prettier
- Run `yarn format` before committing code
- Run `yarn format:check` in CI/CD pipelines
- Configuration (`.prettierrc`):
  - Semi-colons: Required
  - Quotes: Double quotes
  - Print width: 100 characters
  - Tab width: 2 spaces
  - No tabs (use spaces)
  - Trailing commas: ES5 compatible
  - Arrow function parentheses: Always
- Never commit unformatted code

## Comment Style

### When to Comment

- Complex calculations or business logic
- Unit conversions and their rationale
- Data source information (FRED series IDs, etc.)
- TODO items for missing implementations

### Comment Formatting

```typescript
// Single line for brief explanations
// Longer explanations can span
// multiple comment lines

/**
 * SQL Schema for reference:
 *
 * CREATE TABLE IF NOT EXISTS indicators (
 *   ...
 * );
 */
```

## Code Organization

### Section Comments

Use clear section comments with separators:

```typescript
// ==========================================
// 1. Production & Consumption Indicators
// ==========================================
```
