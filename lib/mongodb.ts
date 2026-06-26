/** @format */

import { MongoClient, Db, MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables.");
}

// Connection options tuned for Vercel serverless + MongoDB Atlas
const options: MongoClientOptions = {
  // Keep connections alive in serverless — reuse across warm invocations
  maxPoolSize: 10,
  minPoolSize: 0,
  // Faster timeout for cold starts — Atlas should respond in < 5s if IP is whitelisted
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, reuse across hot-reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (Vercel), each serverless function instance gets its own client
  // but we cache it on the module level so warm invocations reuse it
  const client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("setupgram");
}
