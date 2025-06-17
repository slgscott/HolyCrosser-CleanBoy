# Quick Fix for API Deployment

## Remove the problematic package.json file:

1. Delete `api/package.json` from your GitHub repository
2. Keep only the API function files:
   - api/health.js
   - api/crossing-times/[weekOffset].js  
   - api/tide-times/[weekOffset].js
   - api/weather-data/[weekOffset].js

## Vercel will auto-detect dependencies

The API functions have their import statements at the top, so Vercel will automatically install the required packages without needing a separate package.json file.

## Redeploy steps:

1. Delete api/package.json from GitHub
2. Commit the deletion
3. Redeploy in Vercel
4. Add DATABASE_URL environment variable if not already set

This eliminates the JSON parsing error and lets Vercel handle dependency management automatically.