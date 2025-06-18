import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the Replit-provided DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Check if we're in production and log connection attempts
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = !!process.env.REPL_ID;
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${isReplit ? 'Replit' : 'External'}`);
console.log(`Database connection attempt: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

// Database connection with deployment-optimized settings
const poolConfig = {
  connectionString: databaseUrl,
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