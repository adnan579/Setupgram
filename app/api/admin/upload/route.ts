/** @format */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const maxDuration = 60; // allow up to 60s for large video uploads

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image"; // "image" | "video"

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided." },
        { status: 400 },
      );
    }

    // Size limits: images 10MB, videos 50MB
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Max ${type === "video" ? "50MB" : "10MB"}.`,
        },
        { status: 400 },
      );
    }

    // Convert File to base64 data URI for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Use a loose type for upload options to avoid strict callback-type inference
    const uploadOptions: any = {
      folder: "setupgram/blog",
      resource_type: type === "video" ? "video" : "image",
      // Auto quality + format for images
      ...(type === "image" && {
        quality: "auto",
        fetch_format: "auto",
        transformation: [{ width: 1600, crop: "limit" }],
      }),
      // Video: compress but keep quality
      ...(type === "video" && {
        quality: "auto",
        transformation: [{ width: 1280, crop: "limit" }],
      }),
    };

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

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
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed. Please try again." },
      { status: 500 },
    );
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
