/** @format */

import { MongoClient, Db, MongoClientOptions } from "mongodb";

// Connection options tuned for Vercel serverless + MongoDB Atlas (M0 free tier).
const options: MongoClientOptions = {
  // Every serverless instance opens its own pool, and M0 allows ~500 connections
  // in total, so keep the pool small.
  maxPoolSize: 5,
  minPoolSize: 0,
  // Release idle sockets so paused/idle instances don't hold connections open.
  maxIdleTimeMS: 60_000,
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesEnsured: boolean | undefined;
}

/**
 * Lazily connects (nothing happens at import time) and caches the connection
 * on `global` so it is reused across hot reloads (dev) and warm invocations (prod).
 *
 * If a connection attempt FAILS (e.g. the Atlas free cluster was paused), the cached
 * promise is dropped so the next call retries. Previously a single failed attempt
 * stayed cached, and every request on that instance failed until a cold start.
 */
function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(
      new Error("Please define MONGODB_URI in your environment variables."),
    );
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    const promise = client.connect().catch((error) => {
      global._mongoClientPromise = undefined;
      client.close().catch(() => {});
      throw error;
    });
    global._mongoClientPromise = promise;
  }
  return global._mongoClientPromise;
}

/**
 * Indexes the app relies on. Created once per instance in the background.
 * Safe to re-run: creating an index that already exists is a no-op.
 * Unique indexes also close the check-then-insert race on slugs / certificate IDs.
 */
async function ensureIndexes(db: Db) {
  const jobs: Array<Promise<unknown>> = [
    db.collection("blogs").createIndex({ slug: 1 }, { unique: true }),
    db.collection("blogs").createIndex({ status: 1, createdAt: -1 }),
    db.collection("jobs").createIndex({ slug: 1 }, { unique: true }),
    db.collection("jobs").createIndex({ status: 1, createdAt: -1 }),
    db.collection("certificates").createIndex({ slug: 1 }, { unique: true }),
    db.collection("certificates").createIndex({ certificateId: 1 }, { unique: true }),
    db.collection("certificates").createIndex({ createdAt: -1 }),
    db.collection("leads").createIndex({ createdAt: -1 }),
    db.collection("leads").createIndex({ status: 1 }),
    db.collection("applications").createIndex({ createdAt: -1 }),
    db.collection("applications").createIndex({ jobId: 1 }),
  ];
  // allSettled: one failing index (e.g. existing duplicate slugs blocking a unique
  // index) must not stop the others, and must never break a request.
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    if (r.status === "rejected") {
      console.error("Index creation failed:", r.reason?.message ?? r.reason);
    }
  });
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db("setupgram");

  if (!global._mongoIndexesEnsured) {
    global._mongoIndexesEnsured = true;
    // Fire and forget: don't add latency to the request that triggered it.
    ensureIndexes(db).catch(() => {
      global._mongoIndexesEnsured = false; // retry on a later request
    });
  }

  return db;
}
