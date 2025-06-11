import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the Harbor Data Manager database URL
const harborDbUrl = "postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

// For local preferences, use the local database
const localDbUrl = process.env.DATABASE_URL;

if (!localDbUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Harbor Data Manager connection (read-only)
export const harborPool = new Pool({ connectionString: harborDbUrl });
export const harborDb = drizzle({ client: harborPool, schema });

// Local database connection (for user preferences)
export const localPool = new Pool({ connectionString: localDbUrl });
export const db = drizzle({ client: localPool, schema });