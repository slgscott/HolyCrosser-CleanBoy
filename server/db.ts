import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Check if we're in production and log connection attempts
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = !!process.env.REPL_ID;
const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${isRailway ? 'Railway' : isReplit ? 'Replit' : 'External'}`);
console.log(`Database connection attempt: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

// Database connection with Railway-optimized settings
const poolConfig = {
  connectionString: databaseUrl,
  connectionTimeoutMillis: isRailway ? 15000 : 10000,
  idleTimeoutMillis: isRailway ? 60000 : 30000,
  max: isRailway ? 5 : 3, // Railway can handle more connections
  min: 0,
  allowExitOnIdle: true,
  ssl: isRailway ? { rejectUnauthorized: false } : false
};

export const harborPool = new Pool(poolConfig);
export const harborDb = drizzle(harborPool, { schema });

// Database connection test
async function testDatabaseConnection() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('Database connection attempt:', dbUrl?.split('@')[1]?.split('/')[0] || 'unknown');
    console.log('DATABASE_URL starts with:', dbUrl?.substring(0, 20) || 'not set');
    console.log('Is WebSocket URL?', dbUrl?.includes('wss://') ? 'YES - WRONG FORMAT' : 'NO - Good');
    console.log('Available Railway Postgres vars:', {
      PGHOST: process.env.PGHOST || 'not set',
      PGPORT: process.env.PGPORT || 'not set', 
      PGUSER: process.env.PGUSER || 'not set',
      PGDATABASE: process.env.PGDATABASE || 'not set'
    });
    
    const client = await harborPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full connection error:', error);
    return false;
  }
}

// Test connection asynchronously without blocking startup
testDatabaseConnection().catch(() => {
  console.log('Database connection will be retried on first request');
});