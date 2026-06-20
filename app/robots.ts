/** @format */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/admin/", "/login"],
      },
    ],
    sitemap: "https://setupgram.com/sitemap.xml",
  };
}
