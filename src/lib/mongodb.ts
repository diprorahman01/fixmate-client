
import "server-only";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI environment variable is missing"
  );
}

const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  maxPoolSize: 10,
};

const globalForMongo = globalThis as typeof globalThis & {
  _fixmateMongoClient?: MongoClient;
};

export const mongoClient =
  process.env.NODE_ENV === "production"
    ? new MongoClient(uri, options)
    : (globalForMongo._fixmateMongoClient ??=
        new MongoClient(uri, options));

export const db = mongoClient.db(
  process.env.DB_NAME || "fixmatedb"
);
