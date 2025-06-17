# Critical: GitHub Repository Update Required

## The Problem
Your GitHub repository `slgscott/HolyCrosserMobile` contains version 2.9.0 code, but your Replit environment has version 2.9.1. Vercel deploys from GitHub, causing the persistent v2.9.0 display.

## Immediate Solution
You need to manually update these files in your GitHub repository:

### 1. Update api/health.js
Replace the entire content with:
```javascript
// Holy Crosser v2.9.1 - Final stable release 
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production',
    deploymentId: `${Date.now()}-v291`
  });
}
```

### 2. Add api/health-v291.js
Create new file with:
```javascript
// Holy Crosser v2.9.1 - Force deployment bypass
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production',
    forceDeploy: true,
    buildTime: new Date().getTime()
  });
}
```

### 3. Update vercel.json
Replace with:
```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist/client",
  "functions": {
    "api/health.js": {
      "maxDuration": 10
    },
    "api/health-v291.js": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health-v291"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate, max-age=0"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    }
  ]
}
```

### 4. Steps to Update GitHub
1. Go to GitHub.com → Your repository
2. Edit each file directly in the web interface
3. Commit changes with message: "Force v2.9.1 deployment"
4. Redeploy in Vercel

## Result
Once GitHub has these changes, Vercel will deploy version 2.9.1 correctly.