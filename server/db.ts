import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// External Harbor Data Manager database URL
const harborDbUrl = "postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Check if we're in production and log connection attempts
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = !!process.env.REPL_ID;
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${isReplit ? 'Replit' : 'External'}`);
console.log(`Harbor DB connection attempt: ${harborDbUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

// Local database for user preferences
const localDbUrl = process.env.DATABASE_URL;

if (!localDbUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Harbor Data Manager connection with enhanced production settings
const harborPoolConfig = {
  connectionString: harborDbUrl,
  connectionTimeoutMillis: 15000, // Extended timeout for external connections
  idleTimeoutMillis: 60000,
  statement_timeout: 30000,
  query_timeout: 30000,
  max: isProduction ? 5 : 10,
  ssl: {
    rejectUnauthorized: false // Handle SSL issues in deployment
  }
};

export const harborPool = new Pool(harborPoolConfig);
export const harborDb = drizzle({ client: harborPool, schema });

// Local database connection (for user preferences and app settings)
export const localPool = new Pool({ connectionString: localDbUrl });
export const db = drizzle({ client: localPool, schema });

// Enhanced startup connection test with retry logic
async function testHarborConnection() {
  let attempts = 0;
  const maxAttempts = isProduction ? 3 : 1;
  
  while (attempts < maxAttempts) {
    try {
      const client = await harborPool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log(`Harbor database connection successful (attempt ${attempts + 1})`);
      return true;
    } catch (error) {
      attempts++;
      console.error(`Harbor database connection attempt ${attempts} failed:`, error instanceof Error ? error.message : 'Unknown error');
      
      if (attempts < maxAttempts) {
        console.log(`Retrying connection in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  if (isProduction) {
    console.error('Harbor database connection failed after all attempts - deployment may have external access restrictions');
  }
  return false;
}

testHarborConnection();