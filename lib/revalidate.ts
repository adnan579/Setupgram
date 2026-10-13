/** @format */

import { revalidatePath } from "next/cache";

// Public pages are cached (ISR) and refresh at most every 60s on their own.
// These helpers make an admin change show up IMMEDIATELY instead of waiting.
// They never throw: a failed revalidation must not fail the admin's save.

function safely(fn: () => void) {
  try {
    fn();
  } catch (error) {
    console.error("revalidatePath failed:", error);
  }
}

export function revalidateBlogs() {
  safely(() => {
    revalidatePath("/about");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
  });
}

export function revalidateJobs() {
  safely(() => {
    revalidatePath("/career");
    revalidatePath("/career/jobs/[slug]", "page");
    revalidatePath("/sitemap.xml");
  });
}

export function revalidateCertificates() {
  safely(() => {
    // Matters most for REVOKED certificates: the public page must flip at once.
    revalidatePath("/career/verify/[slug]", "page");
  });
}
