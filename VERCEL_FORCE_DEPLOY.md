# Force Version 2.9.1 Deployment Instructions

## Immediate Action Required

Your Vercel project is not picking up the version 2.9.1 changes. Follow these steps:

### Step 1: Check Git Connection
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Verify the connected repository is `slgscott/HolyCrosserMobile`
3. Verify the production branch is set to `main`

### Step 2: Force Environment Rebuild
1. Go to Project Settings → Environment Variables
2. Add: `DEPLOY_VERSION` = `2.9.1`
3. Click "Save"
4. Go to Deployments tab
5. Click "Redeploy" on the latest deployment

### Step 3: Alternative - Manual API Update
If the above doesn't work, manually update the version in Vercel:

1. Create a simple text file with this content:
```javascript
// Holy Crosser v2.9.1 - Stable release with Harbor Data Manager integration
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production'
  });
}
```

2. Upload this to replace `api/health.js` in your Vercel file system

### Expected Result
After deployment completes, `https://holy-crosser.vercel.app/api/health` should return version 2.9.1

### Test Command
```bash
curl https://holy-crosser.vercel.app/api/health
```

Should return: `{"status":"healthy","timestamp":"...","version":"2.9.1","environment":"production"}`