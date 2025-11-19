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
- Changes `@solana/web3.js` → `@solana/kit` in generated error files

### `maintain-environment.mjs`

Automatically maintains a clean development environment.

**Features:**
- Cleans build artifacts (dist, node_modules)
- Verifies gitignore compliance
- Ensures script permissions are correct
- Checks workspace integrity

**Usage:**
```bash
npm run maintain
```

Or run automatically via:
```bash
npm install  # Runs postinstall hook
```

### `install-git-hooks.mjs`

Installs git hooks for automatic environment maintenance.

**Hooks installed:**
- `pre-commit`: Environment checks before commits
- `post-merge`: Cleanup after merges
- `post-checkout`: Update after branch switches

**Usage:**
```bash
npm run setup:hooks
```

## Development Workflow

When regenerating client code:

```bash
# Generate and fix in one command
npm run generate:clients

# Or manually:
zx ./scripts/generate-clients.mjs
npm run fix:imports
```

### Environment Cleanup

The repository is configured to keep the environment clean:

- **Build artifacts** (`dist/`, `node_modules/`) are automatically gitignored
- **No manual cleanup needed** - gitignore handles exclusions
- **Clean working tree** - only source files are tracked

To verify clean state:
```bash
git status  # Should show clean working tree
```

## Security

All scripts are designed to be minimal and secure:

### Network Security
- ✅ **No external network requests**: Scripts operate entirely offline
- ✅ **No data transmission**: All operations are local file system only
- ✅ **No API calls**: No remote services or dependencies contacted
- ✅ **Deterministic behavior**: Same input always produces same output

### File System Security
- ✅ **Isolated operations**: Only modifies generated files in expected locations
- ✅ **Path validation**: Uses secure path joining (no path traversal)
- ✅ **Read-only where possible**: Validates changes before writing
- ✅ **Error handling**: Clear error messages without exposing sensitive data

### Environment Security
- ✅ **No environment variable access**: Scripts don't read/write env vars
- ✅ **Clean execution**: No temporary files or side effects
- ✅ **Build artifact isolation**: node_modules and dist are gitignored
- ✅ **Minimal permissions**: Only requires read/write to specific files

### Best Practices
- All changes are logged clearly
- Scripts fail fast with descriptive errors
- No use of eval() or dynamic code execution
- Dependencies are minimal and audited
