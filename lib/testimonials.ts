/** @format */

// Client testimonials shown on the home page.
//
// This list is intentionally EMPTY. Only add a testimonial here when:
//   1. it is from a real client, and
//   2. you have their permission (ideally in writing) to publish the quote and name.
// Invented or unverifiable testimonials can breach advertising and consumer-protection rules
// (e.g. India's CCPA guidelines on misleading advertisements and endorsements).
//
// While this list is empty the home page shows a "How we work" section instead.
// As soon as you add an entry, the "Client Stories" section appears automatically.

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // e.g. "Founder, Example Co."
};

export const testimonials: Testimonial[] = [
  // {
  //   quote: "Exactly what the client said, word for word.",
  //   name: "Client Name",
  //   role: "Founder, Company",
  // },
];
