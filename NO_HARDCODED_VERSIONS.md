# CRITICAL: NO HARDCODED VERSIONS POLICY

## NEVER HARDCODE VERSION NUMBERS ANYWHERE

This application uses a centralized version system:

### Single Source of Truth
- **VERSION file** - Contains current version number (e.g., "2.9.2")
- **version-utils.js** - Central version management functions

### How Version System Works
1. All version numbers come from the VERSION file
2. All API endpoints use version-utils.js functions
3. Frontend gets version from API calls, never hardcoded

### Files That Must NEVER Contain Hardcoded Versions
- api/health.js ✓ (uses createHealthResponse)
- api/version.js ✓ (uses createHealthResponse)
- server/routes.ts ✓ (uses getAppVersion)
- client/src/hooks/use-version.tsx ✓ (gets from API)
- client/src/lib/version.ts ✓ (deprecated, no version export)

### To Update Version
1. Edit VERSION file only
2. Restart server
3. Version appears everywhere automatically

### Enforcement
This file serves as a permanent reminder that version numbers must NEVER be hardcoded in source code.