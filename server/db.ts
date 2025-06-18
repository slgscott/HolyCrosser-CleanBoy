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

// Harbor Data Manager connection with deployment-optimized settings
const poolConfig = {
  connectionString: harborDbUrl,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 3,
  min: 0,
  acquireTimeoutMillis: 8000,
  createTimeoutMillis: 8000,
  destroyTimeoutMillis: 5000,
  createRetryIntervalMillis: 200,
  allowExitOnIdle: true
};

export const harborPool = new Pool(poolConfig);
export const harborDb = drizzle({ client: harborPool, schema });

// Database connection test
async function testDatabaseConnection() {
  try {
    const client = await harborPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// Test connection asynchronously without blocking startup
testDatabaseConnection().catch(() => {
  console.log('Database connection will be retried on first request');
});