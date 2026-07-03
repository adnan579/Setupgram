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
  coverImage?: string; // Cloudinary URL
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  experience: string;
  salaryRange?: string;
  excerpt: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: "DRAFT" | "OPEN" | "CLOSED";
  applyEmail: string;
  closingDate?: Date | string | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface JobApplication {
  _id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  resumeUrl?: string;
  coverMessage?: string;
  status: "NEW" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: Date | string;
}

export type CertificateType =
  | "internship"
  | "training"
  | "hackathon"
  | "event"
  | "tech-camp";

export interface Certificate {
  _id: string;
  candidateName: string;
  slug: string;
  certificateId: string;
  type: CertificateType;
  program: string;
  issueDate: Date | string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  description?: string;
  grade?: string;
  mentor?: string;
  certificateImage?: string;
  verificationStatus: "VALID" | "REVOKED";
  createdAt: Date | string;
}
