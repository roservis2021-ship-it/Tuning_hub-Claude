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
        "neon-text": {
          "0%, 100%": {
            textShadow:
              "0 0 6px rgba(255,255,255,0.35), 0 0 14px rgba(230,24,44,0.9), 0 0 30px rgba(230,24,44,0.7), 0 0 52px rgba(230,24,44,0.45)",
          },
          "45%": {
            textShadow:
              "0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(230,24,44,1), 0 0 44px rgba(230,24,44,0.85), 0 0 78px rgba(230,24,44,0.6)",
          },
          "82%": {
            textShadow: "0 0 4px rgba(255,255,255,0.25), 0 0 10px rgba(230,24,44,0.55)",
          },
        },
        shine: {
          "0%": { transform: "translateX(-160%) skewX(-20deg)" },
          "55%, 100%": { transform: "translateX(320%) skewX(-20deg)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.82) translateY(10px)" },
          "60%": { opacity: "1", transform: "scale(1.04) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "backdrop-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-down-in": {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "urgent-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "cta-glow": {
          "0%, 100%": { boxShadow: "0 0 22px rgba(230,24,44,0.45)" },
          "50%": { boxShadow: "0 0 36px rgba(230,24,44,0.8)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        "glow-pulse": "glow-pulse 7s ease-in-out infinite",
        "spotlight-sway": "spotlight-sway 11s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "border-spin": "border-spin 4s linear infinite",
        "neon-text": "neon-text 3.2s ease-in-out infinite",
        shine: "shine 3.8s ease-in-out infinite",
        "pop-in": "pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "backdrop-in": "backdrop-in 0.35s ease-out both",
        "slide-down-in": "slide-down-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "urgent-pulse": "urgent-pulse 1s ease-in-out infinite",
        "cta-glow": "cta-glow 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
