import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mbg";

// Create postgres connection with prepare: false for Supabase Transaction Pooler compatibility
const client = postgres(connectionString, {
  prepare: false,
  max: process.env.NODE_ENV === "production" ? 10 : 1,
});

export const db = drizzle(client, { schema });

