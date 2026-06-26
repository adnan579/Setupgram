/** @format */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && "CLOUDINARY_CLOUD_NAME",
        !apiKey && "CLOUDINARY_API_KEY",
        !apiSecret && "CLOUDINARY_API_SECRET",
      ]
        .filter(Boolean)
        .join(", ");
      console.error("Missing Cloudinary env vars:", missing);
      return NextResponse.json(
        {
          success: false,
          message: `Missing Cloudinary environment variables: ${missing}. Add them in Vercel → Project Settings → Environment Variables.`,
        },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "setupgram/blog";

    // Sign ONLY the params we actually send in the upload FormData
    // transformation must NOT be included — Cloudinary ignores string transformations
    // in direct upload and they break the signature check
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret,
    );

    return NextResponse.json({
      success: true,
      timestamp,
      signature,
      folder,
      cloudName,
      apiKey,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload signature." },
      { status: 500 },
    );
  }
}
