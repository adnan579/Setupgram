/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { createSessionToken, SESSION_COOKIE_MAX_AGE } from "../../../lib/session";
import { checkRateLimit, getClientIp } from "../../../lib/rateLimit";

function safeCompare(a: string, b: string): boolean {
  // Hash both to fixed-length digests first so timingSafeEqual never throws
  // on a length mismatch (a throw itself would be a timing/information leak).
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 5 attempts per 15 minutes per IP
    const { allowed, retryAfterSeconds } = await checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!password || !adminPassword || !safeCompare(String(password), adminPassword)) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set("sg_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
