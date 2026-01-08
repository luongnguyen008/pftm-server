# File Organization

## Directory Structure

```
scripts/                        # Command-line executable scripts
│   ├── app-gen-country-folder.ts
│   └── db-drop-country.ts
src/
├── lib/                        # Pure utility functions
│   ├── logger.ts               # Centralized logging utility (Picocolors)
│   ├── time.ts                 # Date/time utilities (Dayjs)
│   ├── utils.ts                # General utilities (calculations)
│   ├── number-formatter.ts     # Number formatting
│   └── cache.ts                # Caching utilities
├── services/
│   ├── common/                 # Shared service utilities
│   │   ├── repository.ts       # Database operations
│   │   ├── helper.ts           # Service helpers (fetchAndSave)
│   │   ├── fred.ts            # FRED API client
│   │   └── puppeteer-client.ts # Browser automation
│   ├── usa/                    # Country-specific services
│   └── [country]/              # Repeat structure per country
└── types/
    └── index.ts                # All enums and interfaces
```

## Command-Line Scripts

- **REQUIRED**: All command-line executable scripts (to be run via `ts-node`) MUST be placed in the `scripts/` directory.
- Naming convention: Use prefixes to indicate the scope (e.g., `app-`, `db-`, `gen-`).

## File Naming Conventions

- Use numbered prefixes for service files (01-08) to enforce logical update order.
- Each country folder MUST have an identical structure.
- Master runner MUST always be named `index.ts`.

## Country Generator

Use `yarn gen-folder <country_code>` to initialize a new country. This script is located in `scripts/app-gen-country-folder.ts`.

## Master Runner Pattern

- Export a single `updateAll[Country]Indicators` function.
- Call all indicators in logical groups with sequential `await`.
- Use `logger.info` for start and completion messages.
