# Final Working Vercel Configuration

## Update your GitHub vercel.json with this exact content:

```json
{
  "version": 2,
  "buildCommand": "npm run build:client",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "functions": {
    "api/index.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## Create api/index.js file in your GitHub repository:

```javascript
// api/index.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Import your server routes
import('../server/routes.js').then(({ registerRoutes }) => {
  registerRoutes(app);
});

// Serve static files from client/dist
app.use(express.static(join(__dirname, '../client/dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

export default app;
```

## Vercel Project Settings:

- Framework Preset: Other
- Root Directory: ./
- Build Command: npm run build:client  
- Output Directory: client/dist
- Install Command: npm install

## Environment Variables:
- DATABASE_URL: (your database connection string)

This configuration will:
1. Build the React client
2. Create a serverless function for the API
3. Serve static files correctly
4. Handle SPA routing