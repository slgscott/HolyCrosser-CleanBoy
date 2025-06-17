# Deploy API Functions to Vercel

## Files to Add to GitHub Repository

Add these new API files to your HolyCrosserMobile repository:

### 1. api/health.js
```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.0',
    environment: 'production'
  });
}
```

### 2. api/package.json
```json
{
  "type": "module",
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.39.1",
    "ws": "^8.18.0"
  }
}
```

### 3. api/crossing-times/[weekOffset].js
(Copy the crossing times API function created above)

### 4. api/tide-times/[weekOffset].js
(Copy the tide times API function created above)

### 5. api/weather-data/[weekOffset].js
(Copy the weather data API function created above)

## Steps to Deploy:

1. Add all API files to your GitHub repository
2. Commit changes
3. In Vercel project settings, add environment variable:
   - DATABASE_URL: postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
4. Redeploy

## Result:
Your Holy Crosser app will have full database integration with authentic harbor data from Northumberland County Council.