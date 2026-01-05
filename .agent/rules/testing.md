---
trigger: always_on
---

# Testing

## Future Test Structure

When adding tests (not yet implemented), follow this structure:

```
test/
├── lib/
│   ├── time.test.ts
│   ├── utils.test.ts
│   └── number-formatter.test.ts
├── services/
│   ├── common/
│   │   ├── repository.test.ts
│   │   └── fred.test.ts
│   └── usa/
│       ├── surveys.test.ts
│       └── government.test.ts
└── integration/
    └── end-to-end.test.ts
```

## Test Naming Convention

- File: `{module-name}.test.ts`
- Test description: `describe('functionName', () => { ... })`
- Test case: `it('should do something specific', () => { ... })`

## What to Test

**High Priority**:

1. `lib/` utilities (pure functions - easy to test)
2. `services/common/` functions (mock database/API)
3. Derived indicator calculations (with fixture data)

**Medium Priority**:

4. Data transformations
5. Type conversions and casting

**Low Priority**:

6. API integration (use mocks)
7. End-to-end flows (expensive, run less frequently)
