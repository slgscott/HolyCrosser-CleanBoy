# Vercel API Deployment Steps

## Add Debug Endpoint

1. Copy this file to your GitHub repository as `api/debug-connection.js`:

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

export default async function handler(req, res) {
  try {
    // Check if DATABASE_URL exists
    const hasDbUrl = !!process.env.DATABASE_URL;
    const dbUrlLength = process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0;
    const dbUrlPrefix = process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT_SET';
    
    if (!hasDbUrl) {
      return res.status(500).json({
        error: 'DATABASE_URL environment variable is not set',
        hasDbUrl,
        dbUrlLength,
        dbUrlPrefix
      });
    }
    
    // Test connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    
    // Simple query to test connection
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    
    res.status(200).json({
      success: true,
      hasDbUrl,
      dbUrlLength,
      dbUrlPrefix,
      connectionTest: 'SUCCESS',
      serverTime: result.rows[0].current_time
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT_SET'
    });
  }
}
```

## Test Steps

1. Add the debug file to GitHub
2. Redeploy in Vercel
3. Visit `/api/debug-connection` to test database connectivity
4. Check if tables exist with proper schema

## Expected DATABASE_URL Format

Your current: `postgresql://neondb_owner:npg_6UhpKZiB0wjN@ep-falling-feather-adrxwfqv.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`

This looks correct for Neon database format.