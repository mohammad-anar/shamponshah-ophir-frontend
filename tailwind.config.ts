import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        // Deep Royal Purple / Indigo (Admin sidebar, dark accents)
        brand: {
          dark: "#0F0C3B",
          darker: "#0A0826",
          navy: "#18124E",
          deep: "#1E1856",
          primary: "#4F46E5", // Electric violet / royal purple
          hover: "#4338CA",
          light: "#6366F1",
          lavender: "#EDE9FE",
          mist: "#F5F3FF",
          soft: "#EEF2FF",
        },
        // Royal Indigo & Midnight
        obsidian: {
          DEFAULT: "#0F0C3B",
          50: "#18124E",
          100: "#140F40",
          200: "#0F0C3B",
          300: "#0C0A2E",
          400: "#090724",
          500: "#060517",
        },
        primary: {
          DEFAULT: "#0F0C3B", // Primary Royal Navy
          accent: "#4F46E5",
          hover: "#18124E",
          dark: "#0A0826",
          light: "#4F46E5",
        },
        secondary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          dark: "#3730A3",
          light: "#818CF8",
        },
        // Warm Accents (Stars, milestone badges, escrow alerts)
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          DEFAULT: "#F59E0B",
        },
        // Neutral Slate & Backgrounds
        slate: {
          canvas: "#F8F9FD",
          subtle: "#F1F3F9",
          border: "#E2E8F0",
          muted: "#64748B",
          dark: "#1E293B",
          card: "#FFFFFF",
        },
        // Escrow & Trust Badges
        vault: {
          badge: "#EEF2FF",
          border: "#C7D2FE",
          text: "#3730A3",
          goldBadge: "#FEF3C7",
          goldText: "#92400E",
          greenBadge: "#ECFDF5",
          greenText: "#065F46",
        }
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 12, 59, 0.05), 0 1px 2px rgba(15, 12, 59, 0.03)",
        "card-hover": "0 10px 25px -5px rgba(15, 12, 59, 0.08), 0 8px 10px -6px rgba(15, 12, 59, 0.04)",
        "purple-glow": "0 0 20px rgba(79, 70, 229, 0.25)",
        "purple-glow-sm": "0 0 10px rgba(79, 70, 229, 0.15)",
      },
      backgroundImage: {
        "purple-gradient": "linear-gradient(135deg, #18124E 0%, #0F0C3B 100%)",
        "hero-gradient": "linear-gradient(135deg, #1E1856 0%, #0F0C3B 100%)",
        "lavender-card": "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
      },
      screens: {
        xs: "480px",
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
        center: true,
        screens: {
          DEFAULT: "1360px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
