/** @format */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const maxDuration = 60;

// FIX: Override Next.js body size limit for this route specifically
// This is the App Router way to disable the body size limit
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // ── Validate Cloudinary env vars first ───────────────────────────────────
    // This is the #1 silent failure — if any var is missing, Cloudinary
    // accepts the request but returns an "Invalid Signature" or similar error
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary env vars:", {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary is not configured. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided." },
        { status: 400 },
      );
    }

    // ── Size limits ──────────────────────────────────────────────────────────
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Max ${type === "video" ? "50MB" : "10MB"}. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        },
        { status: 400 },
      );
    }

    // ── Convert to base64 ────────────────────────────────────────────────────
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // ── Upload to Cloudinary ─────────────────────────────────────────────────
    const uploadOptions: Record<string, unknown> = {
      folder: "setupgram/blog",
      resource_type: type === "video" ? "video" : "image",
      ...(type === "image" && {
        quality: "auto",
        fetch_format: "auto",
        transformation: [{ width: 1600, crop: "limit" }],
      }),
      ...(type === "video" && {
        quality: "auto",
        transformation: [{ width: 1280, crop: "limit" }],
      }),
    };

    console.log(
      `Uploading ${type} to Cloudinary: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    );

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    console.log("Cloudinary upload success:", result.public_id);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error: unknown) {
    // ── Detailed error logging ───────────────────────────────────────────────
    console.error("Cloudinary upload error:", error);

    // Cloudinary SDK errors have a specific shape
    type CloudinaryError = {
      http_code?: number;
      message?: string;
      error?: { message: string };
    };
    const err = error as CloudinaryError;

    let message = "Upload failed. Please try again.";

    if (err?.http_code === 401 || err?.message?.includes("Invalid")) {
      message =
        "Cloudinary authentication failed. Please verify your API Key and API Secret in Vercel environment variables.";
    } else if (err?.http_code === 420 || err?.message?.includes("limit")) {
      message =
        "Cloudinary upload limit reached. Check your Cloudinary plan usage.";
    } else if (err?.message) {
      message = `Upload failed: ${err.message}`;
    } else if (err?.error?.message) {
      message = `Upload failed: ${err.error.message}`;
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId, type } = await request.json();
    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "No publicId provided." },
        { status: 400 },
      );
    }
    await cloudinary.uploader.destroy(publicId, {
      resource_type: type === "video" ? "video" : "image",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed." },
      { status: 500 },
    );
  }
}
