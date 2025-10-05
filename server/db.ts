import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;

const isLocalDatabase = databaseUrl.includes('localhost') || 
                        databaseUrl.includes('127.0.0.1') || 
                        databaseUrl.includes('sslmode=disable');

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: isLocalDatabase ? false : { rejectUnauthorized: false }
});

export const db = drizzle({ client: pool, schema });
