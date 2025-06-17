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

// Local database for user preferences (optional in deployment)
const localDbUrl = process.env.DATABASE_URL;

if (!localDbUrl && !isProduction) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Harbor Data Manager connection with deployment-optimized settings
const harborPoolConfig = {
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

export const harborPool = new Pool(harborPoolConfig);
export const harborDb = drizzle({ client: harborPool, schema });

// Local database connection (for user preferences and app settings)
export const localPool = localDbUrl ? new Pool({ connectionString: localDbUrl }) : null;
export const db = localPool ? drizzle({ client: localPool, schema }) : null;

// Initialize local database tables if needed
async function initializeLocalTables() {
  try {
    // Create crossing_times table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS crossing_times (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        safe_from_1 TEXT,
        safe_to_1 TEXT,
        safe_from_2 TEXT,
        safe_to_2 TEXT,
        unsafe_from_1 TEXT,
        unsafe_to_1 TEXT,
        unsafe_from_2 TEXT,
        unsafe_to_2 TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT
      );
    `);

    // Create tide_data table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tide_data (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        high_tide_1_time TEXT,
        high_tide_1_height TEXT,
        low_tide_1_time TEXT,
        low_tide_1_height TEXT,
        high_tide_2_time TEXT,
        high_tide_2_height TEXT,
        low_tide_2_time TEXT,
        low_tide_2_height TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT
      );
    `);

    // Create weather_data table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS weather_data (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        temperature DECIMAL,
        temp_min DECIMAL,
        temp_max DECIMAL,
        condition TEXT,
        precipitation DECIMAL,
        wind_direction TEXT,
        wind_speed DECIMAL,
        uv_index INTEGER,
        cloudcover INTEGER,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT
      );
    `);

    console.log('Local database tables initialized');
  } catch (error) {
    console.error('Failed to initialize local tables:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Enhanced startup connection test with fallback initialization
async function testAndInitialize() {
  let harborConnected = false;
  
  try {
    const client = await harborPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Harbor database connection successful');
    harborConnected = true;
  } catch (error) {
    console.error('Harbor database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    if (isProduction) {
      console.log('Initializing local database for deployment environment');
      await initializeLocalTables();
    }
  }
  
  return harborConnected;
}

testAndInitialize();