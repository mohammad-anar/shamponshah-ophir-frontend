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
        serif: ["var(--font-serif)", "var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        cinzel: ["var(--font-cinzel)", "Cinzel", "Georgia", "serif"],
      },
      colors: {
        // Luxury Obsidian / Noir theme from Ophir Reserve
        obsidian: {
          DEFAULT: "#0B0C0E",
          50: "#22252D",
          100: "#1A1D24",
          200: "#16181F",
          300: "#121418",
          400: "#0E1013",
          500: "#0B0C0E",
          900: "#050607",
        },
        // Regal Champagne Gold Accents
        gold: {
          DEFAULT: "#DFB76C",
          50: "#FAF6EE",
          100: "#F5EDDC",
          200: "#EBDAB9",
          300: "#E1C796",
          400: "#DFB76C",
          500: "#D4AF37",
          600: "#B8934A",
          700: "#937335",
          800: "#6E5523",
          900: "#493714",
        },
        brand: {
          dark: "#0B0C0E",
          darker: "#050607",
          navy: "#121418",
          deep: "#16181F",
          surface: "#121418",
          card: "#16181F",
          border: "#262930",
          borderLight: "#333742",
          primary: "#DFB76C", // Regal Champagne Gold
          hover: "#ECC870",
          light: "#F3DC9B",
          lavender: "#1F222B",
          mist: "#16181F",
          soft: "#14161C",
        },
        primary: {
          DEFAULT: "#DFB76C", // Primary Champagne Gold
          accent: "#ECC870",
          hover: "#ECC870",
          dark: "#0B0C0E",
          light: "#F3DC9B",
        },
        secondary: {
          DEFAULT: "#DFB76C",
          hover: "#ECC870",
          dark: "#0B0C0E",
          light: "#F3DC9B",
        },
        // Warm Accents
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#DFB76C",
          600: "#D4AF37",
          700: "#B8934A",
          800: "#92400E",
          900: "#78350F",
          DEFAULT: "#DFB76C",
        },
        // Neutral Slate & Backgrounds
        slate: {
          canvas: "#0B0C0E",
          subtle: "#121418",
          border: "#262930",
          muted: "#9CA3AF",
          dark: "#16181F",
          card: "#121418",
        },
        // Escrow & Trust Badges
        vault: {
          badge: "#1A1D24",
          border: "#DFB76C33",
          text: "#DFB76C",
          goldBadge: "#222018",
          goldText: "#DFB76C",
          greenBadge: "#0D211A",
          greenText: "#34D399",
        }
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(223, 183, 108, 0.15)",
        "gold-glow": "0 0 20px rgba(223, 183, 108, 0.25)",
        "gold-glow-sm": "0 0 10px rgba(223, 183, 108, 0.15)",
        "luxury": "0 4px 20px rgba(0, 0, 0, 0.5)",
        "luxury-xl": "0 12px 40px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #ECC870 0%, #DFB76C 50%, #B8934A 100%)",
        "dark-gradient": "linear-gradient(180deg, #121418 0%, #0B0C0E 100%)",
        "noir-card": "linear-gradient(135deg, #16181F 0%, #101216 100%)",
        "gold-border-gradient": "linear-gradient(90deg, rgba(223,183,108,0.4) 0%, rgba(223,183,108,0) 100%)",
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
