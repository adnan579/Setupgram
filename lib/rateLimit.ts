/** @format */

import { getDb } from "./mongodb";

let indexEnsured = false;

async function ensureIndex(db: Awaited<ReturnType<typeof getDb>>) {
  if (indexEnsured) return;
  try {
    await db.collection("rate_limits").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
  } catch {
    // Non-fatal — index may already exist, or creation raced with another instance
  } finally {
    indexEnsured = true;
  }
}

type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Persistent, serverless-safe rate limiter backed by MongoDB.
 * Not perfectly atomic under heavy concurrency, but more than sufficient
 * to stop scripted brute-force and spam — which is the actual threat here.
 *
 * @param key       Unique bucket key, e.g. `login:${ip}`
 * @param limit     Max requests allowed within the window
 * @param windowMs  Window size in milliseconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const db = await getDb();
  await ensureIndex(db);

  const collection = db.collection("rate_limits");
  const now = new Date();
  const existing = await collection.findOne({ key });

  if (!existing || now.getTime() - new Date(existing.windowStart).getTime() > windowMs) {
    await collection.updateOne(
      { key },
      {
        $set: {
          key,
          count: 1,
          windowStart: now,
          expiresAt: new Date(now.getTime() + windowMs),
        },
      },
      { upsert: true }
    );
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const newCount = (existing.count || 0) + 1;
  await collection.updateOne({ key }, { $set: { count: newCount } });

  const windowStart = new Date(existing.windowStart).getTime();
  const retryAfterSeconds = Math.max(0, Math.ceil((windowStart + windowMs - now.getTime()) / 1000));

  return { allowed: newCount <= limit, retryAfterSeconds };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
