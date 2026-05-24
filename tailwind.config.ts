import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ─── New palette (Synthesis) ─────────────────────────
        // Warm dark editorial. Use these for all new work.
        canvas:   "hsl(var(--canvas))",        // #0E0C0B — page bg
        paper:    "hsl(var(--paper))",         // #15110F — surface
        paperHi:  "hsl(var(--paper-hi))",      // #1B1612 — surface-elevated
        cream:    "hsl(var(--cream))",         // #F4EFE3 — primary text
        signal:   "hsl(var(--signal))",        // #E63946 — Norway red, primary accent
        signalD:  "hsl(var(--signal-deep))",   // #9D1B26 — pressed/deep
        amber:    "hsl(var(--amber))",         // #FFB72E — data highlight
        pitchGrn: "hsl(var(--pitch-green))",   // #3F5642 — turf overlay

        // ─── Legacy palette (kept for incremental migration) ─
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
        win:  "hsl(var(--win))",
        draw: "hsl(var(--draw))",
        loss: "hsl(var(--loss))",
      },
      fontFamily: {
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono:  ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        editorial: "-0.02em",
        kicker:    "0.16em",
      },
      // Extend Tailwind's default opacity scale with the fine-grained values
      // the new editorial palette needs (cream/4, /8, /12 … /85).
      opacity: {
        4:  "0.04",
        8:  "0.08",
        12: "0.12",
        14: "0.14",
        16: "0.16",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        75: "0.75",
        85: "0.85",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
        "holo-shimmer": {
          "0%":   { transform: "translateX(-30%)", opacity: "0" },
          "20%":  { opacity: "1" },
          "80%":  { opacity: "1" },
          "100%": { transform: "translateX(30%)", opacity: "0" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        eq: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%":      { transform: "scaleY(1)" },
        },
      },
      animation: {
        "pulse-dot":    "pulse-dot 1.4s ease-in-out infinite",
        "holo-shimmer": "holo-shimmer 4s ease-in-out infinite",
        marquee:        "marquee 32s linear infinite",
        eq:             "eq 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
