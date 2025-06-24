import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon WebSocket for serverless environments
neonConfig.webSocketConstructor = ws;

// Use DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Check if we're in production and log connection attempts
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = !!process.env.REPL_ID;
const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
const isNeonUrl = databaseUrl.includes('neon.tech');

console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${isRailway ? 'Railway' : isReplit ? 'Replit' : 'External'}`);
console.log(`Database type: ${isNeonUrl ? 'Neon' : 'Standard PostgreSQL'}`);
console.log(`Database connection attempt: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

// Use appropriate client based on database type
let harborPool: PgPool | NeonPool;
let harborDb: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzleNeon>;

if (isNeonUrl) {
  // Use Neon serverless client for Neon databases
  const neonPoolConfig = {
    connectionString: databaseUrl,
    connectionTimeoutMillis: isReplit ? 10000 : 15000,
    idleTimeoutMillis: isReplit ? 30000 : 60000,
    max: 3,
    min: 0,
    acquireTimeoutMillis: 8000,
    createTimeoutMillis: 8000,
    destroyTimeoutMillis: 5000,
    createRetryIntervalMillis: 200,
    allowExitOnIdle: true
  };
  
  harborPool = new NeonPool(neonPoolConfig);
  harborDb = drizzleNeon({ client: harborPool, schema });
} else {
  // Use standard PostgreSQL client for Railway and other PostgreSQL instances
  const pgPoolConfig = {
    connectionString: databaseUrl,
    connectionTimeoutMillis: isRailway ? 15000 : 10000,
    idleTimeoutMillis: isRailway ? 60000 : 30000,
    max: isRailway ? 5 : 3,
    min: 0,
    allowExitOnIdle: true,
    ssl: isRailway ? { rejectUnauthorized: false } : false
  };
  
  harborPool = new PgPool(pgPoolConfig);
  harborDb = drizzlePg(harborPool, { schema });
}

export { harborPool, harborDb };

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
    
    if (isNeonUrl) {
      // Neon client connection test
      const client = (harborPool as NeonPool).connect();
      await client.query('SELECT 1');
      client.release();
    } else {
      // Standard PostgreSQL client connection test
      const client = await (harborPool as PgPool).connect();
      await client.query('SELECT 1');
      client.release();
    }
    
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