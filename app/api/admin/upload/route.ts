/** @format */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/upload
 * Deletes a Cloudinary asset by publicId.
 * File UPLOADS now go directly from the browser to Cloudinary (see MediaUploader.tsx).
 */
export async function DELETE(request: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Cloudinary is not configured." },
        { status: 500 },
      );
    }

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
