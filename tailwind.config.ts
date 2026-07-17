import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        garage: {
          950: "#0a0b0d",
          900: "#121317",
          800: "#1b1d23",
          700: "#2a2d35",
        },
        accent: {
          DEFAULT: "#e6182c",
          dark: "#9c0f1e",
          muted: "#ff8a8a",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.75", transform: "translate(-50%, -50%) scale(1.15)" },
        },
        "spotlight-sway": {
          "0%, 100%": { opacity: "0.55", transform: "translateX(-50%) rotate(-3deg)" },
          "50%": { opacity: "0.85", transform: "translateX(-50%) rotate(3deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-spin": {
          "100%": { transform: "translate(-50%, -50%) rotate(1turn)" },
        },
        "neon-flicker": {
          "0%, 85%, 89%, 93%, 100%": {
            boxShadow: "0 0 18px 3px rgba(230,24,44,0.65), 0 0 42px 10px rgba(230,24,44,0.35)",
            filter: "brightness(1)",
          },
          "87%, 91%": {
            boxShadow: "0 0 6px 1px rgba(230,24,44,0.25)",
            filter: "brightness(0.85)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        "glow-pulse": "glow-pulse 7s ease-in-out infinite",
        "spotlight-sway": "spotlight-sway 11s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "border-spin": "border-spin 4s linear infinite",
        "neon-flicker": "neon-flicker 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
