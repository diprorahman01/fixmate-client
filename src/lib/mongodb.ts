
import "server-only";

import dns from "node:dns";
import { MongoClient } from "mongodb";

// ==========================================
// FIXMATE MONGODB DNS CONFIGURATION
// ==========================================

// Use Google DNS, which passed the DNS test.
dns.setServers(["8.8.8.8"]);

// ==========================================
// MONGODB CONNECTION
// ==========================================

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing in .env.local"
  );
}

// Reuse MongoDB client during Next.js reloads.
const globalForMongo = globalThis as typeof globalThis & {
  _fixmateMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo._fixmateMongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._fixmateMongoClient = mongoClient;
}

export const db = mongoClient.db(
  process.env.DB_NAME || "fixmatedb"
);
