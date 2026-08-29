import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

let envReady = false;

function ensureEnv() {
  if (envReady) return;
  loadEnvConfig(process.cwd());
  envReady = true;
}

export function isDatabaseConfigured() {
  ensureEnv();
  return Boolean(process.env.DATABASE_URL?.trim());
}

function createDb() {
  ensureEnv();
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

let cached: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!cached) {
    cached = createDb();
  }
  return cached;
}

export { schema };
