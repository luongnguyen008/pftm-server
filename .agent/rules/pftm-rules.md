---
trigger: always_on
---

# PFTM Server - Overview

> [!NOTE]
> **Improvement History**: See [IMPROVEMENTS.md](file:///Users/nguyennl-difisoft/pftm-server/IMPROVEMENTS.md) for a log of all infrastructure improvements, new features, and architectural changes made to this project.

## About These Rules

These coding standards ensure consistency, maintainability, and quality across the PFTM Server project. The rules are split into multiple files for easier navigation:

- **code-formatting.md** - Prettier and code style
- **typescript-standards.md** - TypeScript best practices
- **date-time.md** - Date/time handling
- **database.md** - Database patterns
- **error-handling.md** - Error handling and logging
- **file-organization.md** - Project structure
- **data-fetching.md** - API and data patterns
- **module-boundaries.md** - Import and dependency rules
- **testing.md** - Testing conventions

## General Principles

- Write clean, self-documenting code with meaningful variable and function names
- Prefer explicit type annotations over implicit types
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions focused and single-purpose

## Key Principles Summary

1. Use `fetchAndSave` for all indicator fetching
2. Never bypass `upsertIndicators` from services
3. Extract common logic to `lib/` or `services/common/`
4. Follow identical structure for each country
5. Always use enum types, never string literals
6. Keep functions focused and single-purpose
7. Use TypeScript strictly (no `any` types)

## Benefits

These rules ensure:

- ✅ **Code Consistency** - Same patterns across all services
- ✅ **No Duplication** - Reusable utilities in proper locations
- ✅ **Clear Boundaries** - Proper separation between lib/, common/, and services/
- ✅ **Type Safety** - Strict enum usage and type casting
- ✅ **Maintainability** - Easy to understand, modify, and extend
- ✅ **Scalability** - Easy to add new countries and indicators
