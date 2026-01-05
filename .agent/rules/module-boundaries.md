---
trigger: always_on
---

# Module Boundaries

## `lib/` Directory

**Purpose**: Pure utility functions with no business logic

**Rules**:

- No database operations
- No API calls
- No dependencies on `services/`
- Can import from `types/`
- Should be reusable across any project

**Examples**:

- `time.ts` - Date/time conversions
- `utils.ts` - General utilities (unit conversion, etc.)
- `number-formatter.ts` - Number formatting
- `db.ts` - Database connection only (no queries)
- `api-client.ts` - Fetch retry logic
- `cache.ts` - Caching utilities
- `validators.ts` - Data validation utilities

## `services/common/` Directory

**Purpose**: Shared service utilities for indicator data

**Rules**:

- Can import from `lib/` and `types/`
- Can make database calls (via `repository.ts`)
- Can make API calls (FRED, Investing.com)
- Should NOT contain country-specific logic
- Should NOT contain business rules

**Examples**:

- `repository.ts` - Database operations
- `fred.ts` - FRED API client
- `helper.ts` - Service helper functions
- `puppeteer-client.ts` - Browser automation

## `services/[country]/` Directories

**Purpose**: Country-specific indicator implementations

**Rules**:

- Import from `lib/`, `types/`, and `services/common/`
- Never import from other country directories
- Each country should be independent
- Can contain country-specific business logic
- Should follow identical file structure across countries

## Import Direction Rules

```
lib/               (no imports from services/)
  ↑
services/common/   (imports from lib/, types/)
  ↑
services/usa/      (imports from lib/, types/, services/common/)
services/australia/
services/example/
```

**NEVER**:

- Import from sibling country directories
- Import from `services/` in `lib/`
- Create circular dependencies

## Utility Functions Location

- **Utility functions MUST go in the `lib` folder**, not in service files
- Group related functionality (e.g., all USA indicators in `services/usa/index.ts`)
- Extract common logic to `lib/` or `services/common/`
