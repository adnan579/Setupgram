/** @format */

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: Date | string;
}

export interface BlogPost {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage?: string;       // Cloudinary URL
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}
