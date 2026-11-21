import "server-only";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  _fixmateMongoClient?: MongoClient;
  _fixmateMongoConnectPromise?: Promise<MongoClient>;
};

// Reuse one MongoClient per warm Node.js process, including Vercel.
export const mongoClient =
  (globalForMongo._fixmateMongoClient ??= new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    maxPoolSize: 10,
  }));

export const db = mongoClient.db(process.env.DB_NAME || "fixmatedb");

// Connect before Better Auth initializes its indexes. Allow retry after failure.
export function connectToMongoDB(): Promise<MongoClient> {
  if (!globalForMongo._fixmateMongoConnectPromise) {
    globalForMongo._fixmateMongoConnectPromise = mongoClient
      .connect()
      .catch((error: unknown) => {
        globalForMongo._fixmateMongoConnectPromise = undefined;
        throw error;
      });
  }

  return globalForMongo._fixmateMongoConnectPromise;
}
