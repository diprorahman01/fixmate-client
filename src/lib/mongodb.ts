
import "server-only";

import dns from "node:dns";
import { MongoClient } from "mongodb";

// ==========================================
// MONGODB DNS CONFIGURATION
// ==========================================

// Use the same DNS workaround that fixed
// the Express server's MongoDB connection.
dns.setServers(["1.1.1.1"]);

// ==========================================
// MONGODB CONNECTION
// ==========================================

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing in .env.local"
  );
}

// Reuse the MongoDB client during Next.js
// development hot reloads.
const globalForMongo = globalThis as typeof globalThis & {
  _fixmateMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo._fixmateMongoClient ??
  new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._fixmateMongoClient = mongoClient;
}

export const db = mongoClient.db(
  process.env.DB_NAME || "fixmatedb"
);
