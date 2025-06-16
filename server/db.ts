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

// Harbor Data Manager connection with timeout handling
const harborPoolConfig = {
  connectionString: harborDbUrl,
  connectionTimeoutMillis: isProduction ? 5000 : 10000, // Shorter timeout in production
  idleTimeoutMillis: isProduction ? 10000 : 30000,
  max: isProduction ? 2 : 10, // Fewer connections in production
};

export const harborPool = new Pool(harborPoolConfig);
export const harborDb = drizzle({ client: harborPool, schema });

// Local database connection (for user preferences and app settings)
export const localPool = new Pool({ connectionString: localDbUrl });
export const db = drizzle({ client: localPool, schema });

// Test harbor database connectivity on startup
harborPool.connect()
  .then(client => {
    console.log('Harbor database connection successful');
    client.release();
  })
  .catch(error => {
    console.error('Harbor database connection failed:', error.message);
    if (isProduction) {
      console.warn('External database access may be restricted in production deployment');
    }
  });