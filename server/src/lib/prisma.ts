import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  max: 10,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});