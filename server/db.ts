/**
 * Database Connection Module
 * - Configures the Neon PostgreSQL connection pool
 * - Initializes Drizzle ORM with the project schema
 */
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Required for @neondatabase/serverless to work in Node.js environments
neonConfig.webSocketConstructor = ws;

// Singleton instances for the connection pool and Drizzle client
let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Initializes and returns the Neon connection pool
 * Uses the DATABASE_URL environment variable
 */
function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    // Create the pool with the connection string from environment variables
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * Initializes and returns the Drizzle ORM instance
 * This instance is used for all database queries (select, insert, update, delete)
 */
export function getDb() {
  if (!dbInstance) {
    // Wrap the Neon pool with Drizzle and attach the schema definitions
    dbInstance = drizzle(getPool(), { schema });
  }
  return dbInstance;
}

/**
 * Exported DB constant
 * Uses a Proxy to ensure getDb() is called on every access,
 * maintaining the singleton pattern while allowing simple 'db.select()' syntax.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  }
});

// Export the pool getter for session storage or other direct PG needs
export { getPool as pool };
