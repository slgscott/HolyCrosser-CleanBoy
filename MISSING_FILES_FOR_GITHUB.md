# Files to Add to HolyCrosserMobile Repository

## Critical File: vercel.json

Create this file in the root of your HolyCrosserMobile repository:

```json
{
  "version": 2,
  "name": "holy-crosser",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/index.html"
    }
  ],
  "functions": {
    "server/index.ts": {
      "includeFiles": "server/**"
    }
  }
}
```

## Optional Files to Update

### .gitignore
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vercel
```

### package.json scripts section
Make sure you have this build script:
```json
"scripts": {
  "build:client": "cd client && vite build",
  "dev": "tsx server/index.ts"
}
```

## Quick Add to GitHub

1. Go to your HolyCrosserMobile repository on GitHub
2. Click "Add file" → "Create new file"
3. Name it `vercel.json`
4. Copy the vercel.json content above
5. Commit with message: "Add Vercel deployment configuration"

Once you add `vercel.json`, you can immediately connect HolyCrosserMobile to Vercel for deployment.