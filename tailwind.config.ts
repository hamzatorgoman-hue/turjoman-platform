import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#070503",
          800: "#0B0806",
          700: "#120D09",
          600: "#1A130D",
          500: "#241A12",
        },
        gold: {
          100: "#F6E3B8",
          200: "#E8C97A",
          300: "#D4A853",
          400: "#C08B3A",
          500: "#9A6A28",
          600: "#6B4718",
        },
        sand: {
          100: "#F7EFE3",
          200: "#E2D2BC",
          300: "#B99C79",
          400: "#8A7259",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        latin: ["var(--font-latin)", "Georgia", "serif"],
      },
      fontSize: {
        "hero-sm": ["2.25rem", { lineHeight: "1.28", letterSpacing: "-0.01em" }],
        "hero-md": ["3.25rem", { lineHeight: "1.24", letterSpacing: "-0.015em" }],
        "hero-lg": ["4.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        cta: "0 18px 40px -18px rgba(212,168,83,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
        panel: "0 30px 80px -40px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "gold-bar":
          "linear-gradient(100deg, #9A6A28 0%, #D4A853 28%, #F6E3B8 52%, #D4A853 74%, #9A6A28 100%)",
        "gold-text":
          "linear-gradient(180deg, #F6E3B8 0%, #D4A853 55%, #9A6A28 100%)",
      },
      keyframes: {
        "ambient-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.75" },
          "50%": { transform: "translate3d(-0.8%, 0.8%, 0) scale(1.03)", opacity: "1" },
        },
        "lamp-flicker": {
          "0%, 100%": { opacity: "0.92" },
          "45%": { opacity: "1" },
          "55%": { opacity: "0.86" },
        },
        "plate-breathe": {
          "0%, 100%": { transform: "scale(1.02)" },
          "50%": { transform: "scale(1.045)" },
        },
        "sheen": {
          "0%": { transform: "translateX(-140%)" },
          "100%": { transform: "translateX(140%)" },
        },
      },
      animation: {
        "ambient-drift": "ambient-drift 24s ease-in-out infinite",
        "lamp-flicker": "lamp-flicker 7s ease-in-out infinite",
        "plate-breathe": "plate-breathe 32s ease-in-out infinite",
        sheen: "sheen 1.1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
