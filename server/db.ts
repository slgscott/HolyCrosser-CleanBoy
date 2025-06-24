import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon WebSocket for serverless environments
neonConfig.webSocketConstructor = ws;

// Use DATABASE_URL environment variable or construct from Railway variables
let databaseUrl = process.env.DATABASE_URL;

// If DATABASE_URL is not set or if we're on Railway with individual variables, construct it
// Force construction on Railway even if DATABASE_URL exists (in case it's outdated)
if (!databaseUrl || process.env.RAILWAY_ENVIRONMENT) {
  const host = process.env.PGHOST || process.env.DB_HOST;
  const port = process.env.PGPORT || process.env.DB_PORT || '5432';
  const user = process.env.PGUSER || process.env.DB_USER || 'postgres';
  const password = process.env.PGPASSWORD || process.env.DB_PASSWORD;
  const database = process.env.PGDATABASE || process.env.DB_NAME || 'railway';
  
  if (host && password) {
    databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    console.log('Constructed DATABASE_URL from individual variables');
  }
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set and cannot be constructed from individual variables');
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
  harborDb = drizzleNeon(harborPool, { schema });
} else {
  // Use standard PostgreSQL client for Railway and other PostgreSQL instances
  const pgPoolConfig = {
    connectionString: databaseUrl,
    connectionTimeoutMillis: isRailway ? 20000 : 10000,
    idleTimeoutMillis: isRailway ? 60000 : 30000,
    max: isRailway ? 5 : 3,
    min: 0,
    allowExitOnIdle: true,
    ssl: isRailway ? { rejectUnauthorized: false } : false,
    // Railway-specific connection options
    ...(isRailway && {
      query_timeout: 30000,
      statement_timeout: 30000,
      application_name: 'holy-crosser'
    })
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
    console.log('Full DATABASE_URL (masked):', dbUrl?.replace(/:([^:@]+)@/, ':****@') || 'not set');
    console.log('Available Railway Postgres vars:', {
      PGHOST: process.env.PGHOST || 'not set',
      PGPORT: process.env.PGPORT || 'not set', 
      PGUSER: process.env.PGUSER || 'not set',
      PGDATABASE: process.env.PGDATABASE || 'not set',
      PGPASSWORD: process.env.PGPASSWORD ? '****' : 'not set',
      DB_HOST: process.env.DB_HOST || 'not set',
      DB_PORT: process.env.DB_PORT || 'not set',
      DB_USER: process.env.DB_USER || 'not set',
      DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'not set',
      DB_NAME: process.env.DB_NAME || 'not set'
    });
    
    if (isNeonUrl) {
      // Neon client connection test
      const client = await (harborPool as NeonPool).connect();
      await client.query('SELECT 1');
      await client.release();
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
testDatabaseConnection().catch((error) => {
  console.error('Initial database connection failed:', error.message);
  console.log('Database connection will be retried on first request');
});