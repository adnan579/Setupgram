/** @format */

// People shown on the About page.
//
// Bios are deliberately limited to what each role does. Add specifics (previous employers,
// years of experience, results) ONLY when they are true and you can prove them, because
// the site is advertising and a false claim can breach advertising rules.
//
// To show a real photo, put the image in /public/team/ and set `photo`, e.g. "/team/adnan.jpg"
// (square, at least 320x320). Without a photo the person's initial is shown.
// IMPORTANT: confirm that each name below is a real, current team member.

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  accent: "primary" | "secondary";
  photo?: string;
};

export const team: TeamMember[] = [
  {
    name: "Adnan",
    role: "Founder & CTO",
    bio: "Leads engineering: web and mobile apps, AI chatbot integrations and the technology behind every project.",
    accent: "primary",
  },
  {
    name: "Maqsood Ali",
    role: "Co-Founder & Strategy Lead",
    bio: "Leads strategy and consulting: digital transformation roadmaps and growth planning for client businesses.",
    accent: "secondary",
  },
  {
    name: "Dev Nair",
    role: "Head of AI & Integrations",
    bio: "Leads AI and integrations: practical automation and chatbot solutions that fit how a business already works.",
    accent: "primary",
  },
];
