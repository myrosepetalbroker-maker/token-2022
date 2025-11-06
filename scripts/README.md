# Scripts Directory

This directory contains utility scripts for maintaining the token-2022 repository.

## Scripts

### `generate-clients.mjs`

Generates client code from the IDL (Interface Definition Language) using Codama.

**Usage:**
```bash
npm run generate:clients
```

This will:
1. Generate JavaScript client code from `interface/idl.json`
2. Automatically fix import paths (see below)

### `fix-generated-imports.mjs`

Automatically fixes import paths in generated files to use the correct package.

**Problem:** The Codama generator sometimes generates imports from `@solana/web3.js`, but this project uses `@solana/kit` as the peer dependency.

**Solution:** This script automatically patches the generated files after code generation.

**Usage:**
```bash
npm run fix:imports
```

Or run automatically with:
```bash
npm run generate:clients  # Includes fix:imports
```

**What it fixes:**
- Changes `@solana/web3.js` → `@solana/kit` in `clients/js/src/generated/errors/associatedToken.ts`

## Development Workflow

When regenerating client code:

```bash
# Generate and fix in one command
npm run generate:clients

# Or manually:
zx ./scripts/generate-clients.mjs
npm run fix:imports
```

## Security

All scripts are designed to be minimal and secure:
- ✅ No external network requests
- ✅ Only modifies generated files in expected locations
- ✅ Validates changes before writing
- ✅ Clear error messages and logging
