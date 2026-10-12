/** @format */

// Signed, stateless admin session tokens using HMAC-SHA256 (Web Crypto API).
// Works in both the Node.js runtime (API routes) and the Edge runtime (middleware).

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a long random string (e.g. `openssl rand -hex 32`) in your environment variables."
    );
  }
  return secret;
}

function fromBase64Url(b64url: string) {
  const padded = b64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    b64url.length + ((4 - (b64url.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  // Explicitly back the array with a real ArrayBuffer (not SharedArrayBuffer)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed session token: base64url(payload).base64url(signature)
 * Payload = { iat, exp } — no user data needed, there's a single admin.
 */
export async function createSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ iat: now, exp: now + SESSION_MAX_AGE_SECONDS });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(signature));

  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies a session token's signature and expiry.
 * Returns true only if the signature matches AND the token hasn't expired.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;

  try {
    const key = await getHmacKey();
    const signature = fromBase64Url(sigB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp >= now;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;
