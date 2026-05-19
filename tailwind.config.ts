import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "hsl(var(--pitch-50))",
          100: "hsl(var(--pitch-100))",
          200: "hsl(var(--pitch-200))",
          300: "hsl(var(--pitch-300))",
          400: "hsl(var(--pitch-400))",
          500: "hsl(var(--pitch-500))",
          600: "hsl(var(--pitch-600))",
          700: "hsl(var(--pitch-700))",
          800: "hsl(var(--pitch-800))",
          900: "hsl(var(--pitch-900))",
          950: "hsl(var(--pitch-950))",
        },
        accent: {
          300: "hsl(var(--accent-300))",
          400: "hsl(var(--accent-400))",
          500: "hsl(var(--accent-500))",
          600: "hsl(var(--accent-600))",
        },
        data: {
          300: "hsl(var(--data-300))",
          400: "hsl(var(--data-400))",
          500: "hsl(var(--data-500))",
        },
        win: "hsl(var(--win))",
        draw: "hsl(var(--draw))",
        loss: "hsl(var(--loss))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
