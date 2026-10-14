/** @format */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        dark: "#050505",
        primary: "#00f0ff",   // Cyberpunk Cyan
        secondary: "#b026ff", // AI Purple (fine for backgrounds and large text)
        // Lighter purple for SMALL text: #b026ff is only 4.4:1 on the dark background
        // (WCAG AA needs 4.5:1); this one is ~7.6:1.
        "secondary-light": "#c77dff",
        // Tailwind's default gray-500 (#6b7280) is only ~4.0:1 on the dark background,
        // which fails WCAG AA for body text. This lighter value is ~6:1 everywhere,
        // so every `text-gray-500` on the site passes without touching each usage.
        gray: {
          500: "#8b93a1",
        },
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        "spin-slow-reverse": "spin 15s linear infinite reverse",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
